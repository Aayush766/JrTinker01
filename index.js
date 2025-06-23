require("dotenv").config();
const express = require("express");
const app = express();
const dbConnection = require("./utils/db");
const router = require("./routes/route");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy; // Use const for consistency
const userModel = require("./models/User");
const compression = require('compression'); // <<< ADD THIS FOR GZIP COMPRESSION

const sessionSecret = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 8000; // <<< Provide a default port

// --- CORS Configuration ---
app.use(
  cors({
    // <<< IMPORTANT: For production, replace localhost with your actual frontend domain (Hostinger URL)
    // Make sure these are HTTPS for production deployments!
    origin: [
      "https://jrtinker.com", // Your production frontend URL (Hostinger)
      "http://localhost:5234", // Your local frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression()); // <<< ADD THIS HERE TO ENABLE GZIP COMPRESSION FOR ALL RESPONSES

// --- Session Configuration ---
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      // <<< CRITICAL FOR HTTPS & CROSS-ORIGIN
      secure: process.env.NODE_ENV === 'production', // true in production (requires HTTPS), false in dev
      httpOnly: true, // Prevents client-side JS access to cookie
      sameSite: 'none', // Allows cross-site cookie transmission (e.g., from Render to Hostinger)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// --- Passport Google Strategy ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // <<< Consistent casing: GOOGLE_CLIENT_ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // <<< Consistent casing: GOOGLE_CLIENT_SECRET
      // <<< IMPORTANT: This callbackURL MUST be HTTPS for production deployments (Render URL)
      callbackURL: process.env.NODE_ENV === 'production'
                   ? "https://jrtinker01.onrender.com/api/auth/google/callback" // Your production backend URL
                   : "http://localhost:4600/api/auth/google/callback", // Your local backend URL
      scope: ["email", "profile"],
    },
    async (request, accessToken, refreshToken, profile, done) => {
      // console.log("profile: ", profile); // Keep for debugging if needed
      try {
        let user = await userModel.findOne({ googleID: profile.id }); // <<< Use 'let' for re-assignment

        if (!user) { // If user does not exist, create new user
          user = await userModel.create({ // <<< AWAIT the creation and assign to 'user'
            googleID: profile.id,
            profilepic: profile.photos[0].value,
            email: profile.emails[0].value,
            username: profile.displayName,
          });
          // No need for separate console.log, it will be returned below
        }
        // Always return the found or newly created user
        return done(null, user);
      } catch (error) { // <<< Consistent error variable name
        console.error("Google Strategy Error:", error); // Log the actual error
        return done(error, null); // Pass the error to Passport
      }
    }
  )
);

// --- Passport Serialization/Deserialization ---
passport.serializeUser(function (user, done) {
  // console.log("serialize user: ",user); // Keep for debugging if needed
  // <<< RECOMMENDED: Serialize only essential user info to session, like ID
  // This reduces session size and makes deserialization more efficient
  done(null, user.id); // Store only the user ID
});

passport.deserializeUser(async function (id, done) { // <<< Make async to use await
  // console.log("deserialize user: ",id); // Keep for debugging if needed
  // <<< RECOMMENDED: Retrieve the user object from the database using the stored ID
  try {
    const user = await userModel.findById(id); // Find user by ID
    done(null, user); // Pass the retrieved user object
  } catch (error) {
    console.error("Deserialize User Error:", error); // Log the actual error
    done(error, null); // Pass the error to Passport
  }
});

// --- Google OAuth Routes ---
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    // <<< IMPORTANT: These redirects MUST be HTTPS for production deployments (Hostinger URL)
    successRedirect: process.env.NODE_ENV === 'production'
                     ? "https://jrtinker.com/courses"
                     : "http://localhost:5234/courses",
    failureRedirect: process.env.NODE_ENV === 'production'
                     ? "https://jrtinker.com/login"
                     : "http://localhost:5234/login",
  }),
  (req, res) => {
    // This callback function often doesn't execute as the redirect happens before it.
    // The req.user object is already populated by Passport at this point.
    // If you need to store more custom data in session, it's usually done in serializeUser
    // or handled on the successRedirected frontend page.
    console.log("google login req.session:", req.session);
    console.log("User from Passport session in callback:", req.user); // req.user will be populated here
    // Manual session data assignment is generally not needed if Passport is managing req.user
    // If you explicitly want custom session data for non-Passport use, ensure it doesn't conflict.
    /*
    req.session.user = {
      id: req.user._id,
      name: req.user.username, // Assuming your user model has a 'username' field
      email: req.user.email,
    };
    */
  }
);

// --- Database Connection & Server Start ---
dbConnection()
  .then(() => {
    console.log("DB connection successful");
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection error:", error); // <<< Use console.error for errors
  });

app.use("/", router);
module.exports = app;