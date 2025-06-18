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
const userModel = require("./models/User"); // Correct model for user operations

const sessionSecret = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 8000; // Provide a default port

// --- CORS Configuration (FIXED) ---
app.use(
  cors({
    origin: ["https://jrtinker.com", "http://localhost:3000"], // Added localhost for dev, remove in pure prod
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
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
    secret: sessionSecret,
    cookie: {
      secure: true, // Essential for HTTPS in production
      httpOnly: true, // Prevents client-side JS access to cookie
      sameSite: 'none', // Crucial for cross-origin cookie sending (Hostinger to Render)
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Ensure env variable name is correct
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Ensure env variable name is correct
      callbackURL: "https://jrtinker01.onrender.com/api/auth/google/callback",
      scope: ["email", "profile"],
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ googleID: profile.id }); // Use 'let'

        if (!user) { // If user does not exist, create new user
          user = await userModel.create({ // Await creation and assign to 'user'
            googleID: profile.id,
            profilepic: profile.photos[0].value,
            email: profile.emails[0].value,
            username: profile.displayName,
          });
        }
        return done(null, user); // Always return the found or newly created user
      } catch (error) {
        console.error("Google Strategy Error:", error); // Log Passport errors
        return done(error, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  // Serialize only essential user info to session, like ID
  // This reduces session size and makes deserialization more efficient
  done(null, user.id); // Store only the user ID
});

passport.deserializeUser(async function (id, done) {
  // Deserialize user from session using the stored ID
  try {
    const user = await userModel.findById(id);
    done(null, user); // Pass the retrieved user object
  } catch (error) {
    console.error("Deserialize User Error:", error);
    done(error, null);
  }
});


app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://jrtinker.com/courses",
    failureRedirect: "https://jrtinker.com/login",
  }),
  (req, res) => {
    // This callback function often doesn't execute as the redirect happens
    // before it. The user object is already attached to req.user by Passport.
    // console.log("google login req is: ", req.session);
    // console.log("User from Passport session in callback:", req.user);
    // If you need to store more custom data, do it in serialize/deserialize or
    // in the successRedirected frontend page.
  }
);

dbConnection()
  .then(() => {
    console.log("DB connection successful");
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection error:", error); // Use console.error for errors
  });

app.use("/", router);
module.exports = app;
