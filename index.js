require("dotenv").config();
const express = require("express");
const app = express();
const dbConnection = require("./utils/db");
const router = require("./routes/route");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth2").Strategy;
const userModel = require("./models/User");

const sessionSecret = process.env.SESSION_SECRET;
const PORT = process.env.PORT;

// --- CORS Configuration (FIXED) ---
// Changed origin from localhost to your Hostinger frontend URL
app.use(
  cors({
    origin: ["https://jrtinker.com"], // Ensure this matches your frontend domain exactly
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Important for sending/receiving cookies across origins
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Session Configuration (FIXED for SameSite cookie issue) ---
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: sessionSecret, // Ensure this is a strong, unique secret
    cookie: {
      secure: true, // Essential for HTTPS in production (Render provides HTTPS)
      httpOnly: true, // Good security practice: prevents client-side JS access to cookie
      sameSite: 'none', // Crucial for cross-origin cookie sending (Hostinger to Render)
      // Optional: Add maxAge if you want sessions to expire after a certain time, e.g.:
      // maxAge: 24 * 60 * 60 * 1000 // Session lasts for 24 hours
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Google_CLIENT_ID,
      clientSecret: process.env.Google_CLIENT_SECRET,
      // --- Google OAuth callbackURL (FIXED) ---
      // This must be your Render backend's public URL for the callback endpoint
      callbackURL: "https://jrtinker01.onrender.com/api/auth/google/callback",
      scope: ["email", "profile"],
    },
    async (request, accessToken, refreshToken, profile, done) => {
      // console.log("profile: ", profile);
      try {
        const userExist = await userModel.findOne({ googleID: profile.id });

        if (!userExist) {
          userModel.create({
            googleID: profile.id,
            profilepic: profile.photos[0].value,
            email: profile.emails[0].value,
            username: profile.displayName,
          });
        }

        return done(null, userExist);
      } catch (error) {
        // Ensure 'err' is defined if 'error' is caught
        return done(error, null); // Pass error as first argument, null user
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log("serialize user: ",user)
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log("deserialize user: ",user)
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    // --- Google OAuth Redirects (FIXED) ---
    // These must be your Hostinger frontend URLs
    successRedirect: "https://jrtinker.com/courses",
    failureRedirect: "https://jrtinker.com/login",
  }),
  (req, res) => {
    // Save user data in session manually if needed
    console.log("google login req is: ",req.session)
    req.session.user = {
      id: req.user._id,      // assuming req.user exists and is your DB user
      name: req.user.username, // Use username from profile, not a generic 'name'
      email: req.user.email,
    };

    // Note: The successRedirect/failureRedirect handles the actual redirection.
    // This block might not execute if the redirect happens immediately.
    // If you need custom logic AFTER redirect, you might need to handle it differently
    // or chain middleware that executes before the redirect.
  }
);

dbConnection()
  .then(() => {
    console.log("db connection successfull");
    app.listen(PORT, () => {
      console.log(`server is running at port ${PORT} `);
    });
  })
  .catch((error) => {
    console.log("db index.js error: ", error);
  });

app.use("/", router);
module.exports = app;
