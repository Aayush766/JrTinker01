require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const app = express();
const dbConnection = require("./utils/db"); // Database connection utility
const router = require("./routes/route"); // Your main API routes
const blogRoutes = require("./routes/blog.route.js"); // Your blog specific routes
const cors = require("cors"); // CORS middleware
const cookieParser = require("cookie-parser"); // Cookie parsing middleware
const session = require("express-session"); // Session management middleware
const passport = require("passport"); // Passport authentication middleware
const GoogleStrategy = require("passport-google-oauth2").Strategy; // Google OAuth 2.0 strategy
const userModel = require("./models/User"); // Your User Mongoose model
const compression = require('compression'); // Gzip compression middleware

const sessionSecret = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 8000; // Define server port, with a default

// --- Core Middleware ---
// Order matters for middleware that processes requests before routes
app.use(compression()); // Enable Gzip compression for all responses early
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// --- CORS Configuration ---
app.use(
  cors({
    origin: [
      "https://jrtinker.com",      // Production frontend URL on Hostinger
      "http://localhost:5234",     // Local development frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent with cross-origin requests
  })
);

// --- Session Configuration (for Passport and general session management) ---
app.use(
  session({
    secret: sessionSecret, // Secret key for signing the session ID cookie
    resave: false, // Don't save session if not modified
    saveUninitialized: true, // Save new sessions even if not modified
    cookie: {
      // Configure cookie properties for security and cross-origin compatibility
      secure: process.env.NODE_ENV === 'production', // true in production (requires HTTPS), false in dev
      httpOnly: true, // Prevents client-side JavaScript access to the cookie
      sameSite: 'none', // Allows cross-site cookie transmission (crucial for different domains)
    },
  })
);

// --- Passport Initialization ---
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Enable Passport session support

// --- Passport Google OAuth 2.0 Strategy Configuration ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID from environment variables
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google Client Secret
      callbackURL: process.env.NODE_ENV === 'production'
                     ? "https://jrtinker01.onrender.com/api/auth/google/callback" // Production backend callback URL
                     : "http://localhost:4600/api/auth/google/callback", // Local backend callback URL
      scope: ["email", "profile"], // Requested user information from Google
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ googleID: profile.id }); // Try to find existing user by Google ID

        if (!user) { // If user does not exist, create a new one
          user = await userModel.create({
            googleID: profile.id,
            profilepic: profile.photos[0].value,
            email: profile.emails[0].value,
            username: profile.displayName,
          });
        }
        return done(null, user); // Pass the user object to Passport
      } catch (error) {
        console.error("Google Strategy Error:", error); // Log any errors during the process
        return done(error, null); // Pass the error to Passport
      }
    }
  )
);

// --- Passport Serialization/Deserialization (for session management) ---
passport.serializeUser(function (user, done) {
  // Store only the user ID in the session (smaller, more efficient)
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    // Retrieve the full user object from the database using the stored ID
    const user = await userModel.findById(id);
    done(null, user); // Pass the retrieved user object to req.user
  } catch (error) {
    console.error("Deserialize User Error:", error); // Log any errors during deserialization
    done(error, null); // Pass the error to Passport
  }
});

// --- Google OAuth Authentication Routes ---
app.get(
  "/auth/google", // Route to initiate Google OAuth login
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/api/auth/google/callback", // Google's redirect URI after authentication
  passport.authenticate("google", {
    successRedirect: process.env.NODE_ENV === 'production'
                     ? "https://jrtinker.com/courses" // Frontend URL to redirect to on success
                     : "http://localhost:5234/courses",
    failureRedirect: process.env.NODE_ENV === 'production'
                     ? "https://jrtinker.com/login" // Frontend URL to redirect to on failure
                     : "http://localhost:5234/login",
  }),
  (req, res) => {
    // This block typically only runs if there's no redirect,
    // useful for debugging or additional server-side session setup if needed.
    console.log("Google login callback completed.");
    console.log("req.session:", req.session);
    console.log("User from Passport session (req.user):", req.user);
  }
);

// --- Mount your custom API routes and blog routes (CRITICAL PLACEMENT) ---
// These MUST be defined BEFORE app.listen() to ensure they are registered
// and can handle incoming requests.
app.use("/", router); // Mount your main router at the root path
app.use("/api/blogs", blogRoutes); // Mount your blog routes

// --- Database Connection & Server Start ---
dbConnection()
  .then(() => {
    console.log("DB connection successful");
    // Start the Express server after a successful database connection
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    // Log database connection errors and exit if critical
    console.error("DB connection error: Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process if DB connection fails
  });

// Export the app for testing or other modules if needed
module.exports = app;