require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const userModel = require("./models/User");
const courseModel = require("./models/Course"); // Assuming you have this
const app = express();

const PORT = process.env.PORT || 4600;
const MONGO_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Middleware
app.use(
  cors({
    origin: "https://jrtinker.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://jrtinker.com");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
  })
);

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Google_CLIENT_ID,
      clientSecret: process.env.Google_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
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
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

// Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_SUCCESS,
    failureRedirect: process.env.FRONTEND_FAIL,
  })
);

// Auth check (optional)
app.get("/api/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});


app.get("/admin/course-dashboard/all-courses", async (req, res) => {
  try {
    const courses = await courseModel.find({});
    res.status(200).json({ courses }); // ✅ Always return an object
  } catch (err) {
    console.error("Course fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
