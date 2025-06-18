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

app.use(
  cors({
    origin: ["https://jrtinker.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: sessionSecret,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Google_CLIENT_ID,
      clientSecret: process.env.Google_CLIENT_SECRET,
      callbackURL: "https://jrtinker01.onrender.com/api/auth/google/callback",
      // passReqToCallback   : true
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
        return done(err, user);
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
    successRedirect: "https://jrtinker.com/courses",
    failureRedirect: "https://jrtinker.com/login",
  }),
  (req, res) => {
    // Save user data in session manually if needed
    console.log("google login req is: ",req.session)
    req.session.user = {
      id: req.user._id,     // assuming req.user exists and is your DB user
      name: req.user.name,
      email: req.user.email,
    };

    // res.redirect("/dashboard");
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
