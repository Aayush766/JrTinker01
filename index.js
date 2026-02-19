require("dotenv").config(); // Load environment variables from .env file
console.log("Using MONGODB_URI:", process.env.MONGODB_URI);

const express = require("express");
const app = express();
const dbConnection = require("./utils/db");
const router = require("./routes/route");
const blogRoutes = require("./routes/blog.route.js");

// ADD THIS LINE
const courseRoutes = require("./routes/course.route.js"); // Assuming this file exists

const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const userModel = require("./models/User");
const compression = require('compression');
const sitemapRouter = require("./routes/sitemap");
const adminRouter = require("./routes/admin.route.js");
const authRouter = require('./routes/auth.routes.js');
const summerCampRoutes = require('./routes/summerCamp.routes');

// NEW: Import the new middleware
const checkAuth = require("./middlewares/checkAuth.js");

const sessionSecret = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 8000;

// --- Core Middleware ---
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS Configuration ---
app.use(
  cors({
    origin: [
      "https://jrtinker.com",
      "http://localhost:5234",
    "http://localhost:5000",
    "https://www.jrtinker.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// --- Session Configuration (CRITICAL for Passport) ---
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'none',
    },
  })
);

// --- Passport Initialization ---
app.use(passport.initialize());
app.use(passport.session());

// --- THIS IS THE KEY FIX ---
// The `checkAuth` middleware runs after Passport,
// so it can handle JWT-authenticated users if a Passport session isn't found.
app.use(checkAuth);

// --- Passport Google OAuth 2.0 Strategy Configuration ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'production'
        ? "https://jrtinker01.onrender.com/api/auth/google/callback"
        : "http://localhost:4600/api/auth/google/callback",
      scope: ["email", "profile"],
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ googleID: profile.id });
        if (!user) {
          user = await userModel.create({
            googleID: profile.id,
            profilepic: profile.photos[0].value,
            email: profile.emails[0].value,
            username: profile.displayName,
          });
        }
        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error:", error);
        return done(error, null);
      }
    }
  )
);

// --- Passport Serialization/Deserialization ---
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Deserialize User Error:", error);
    done(error, null);
  }
});

// --- Google OAuth Authentication Routes ---
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.NODE_ENV === 'production'
      ? "https://jrtinker.com/courses"
      : "http://localhost:5234/courses",
    failureRedirect: process.env.NODE_ENV === 'production'
      ? "https://jrtinker.com/login"
      : "http://localhost:5234/login",
  }),
  (req, res) => {
    console.log("Google login callback completed.");
    console.log("req.session:", req.session);
    console.log("User from Passport session (req.user):", req.user);
  }
);

// --- Mount your custom API routes ---
// The order is important
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.use('/', authRouter);
app.use("/", sitemapRouter);
app.use("/admin", adminRouter);
app.use("/", router);
app.use("/api/blogs", blogRoutes);

// ADD THIS LINE
app.use("/api/courses", courseRoutes); 
// ADD THIS LINE

app.use('/api/summercamp', summerCampRoutes);

// --- Database Connection & Server Start ---
dbConnection()
  .then(() => {
    console.log("DB connection successful");
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection error: Failed to connect to MongoDB", error);
    process.exit(1);
  });

module.exports = app;
