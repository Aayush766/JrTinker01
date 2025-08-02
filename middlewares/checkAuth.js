// backend/middlewares/checkAuth.js
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  // Passport.js has already run and populated req.user if a session exists.
  // So we only need to check for the JWT token if req.user is not already set.
  if (req.user) {
    return next();
  }

  const token = req.cookies["jwt-intern-token"];

  if (!token) {
    return next(); // No token found, user is not authenticated via JWT
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Populate req.user with the JWT payload
    next();
  } catch (error) {
    // If the token is invalid or expired, clear the cookie
    res.clearCookie("jwt-intern-token");
    next(); // Continue, but without a user object
  }
};

module.exports = checkAuth;