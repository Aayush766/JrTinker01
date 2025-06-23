const jwt = require("jsonwebtoken");



const isLoggedIn = (req, res, next) => {

  // Check for JWT in the cookies

  const token = req.cookies["jwt-intern-token"];



  console.log("req.session:", req.session);

  console.log("req.user (from session):", req.user); // User from Passport session

  console.log("JWT token:", token);



  // If neither a JWT nor a session user exists, deny access

  if (!token && !req.user) {

    return res.status(401).json({ message: "Access denied. Please login." });

  }



  try {

    if (token) {

      // If a JWT token exists, verify it and set `req.user`

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = decoded; // Attach the decoded JWT user info to `req.user`

      req.token = token;  // Store the token in `req.token` if needed

      return next(); // Proceed to the next middleware/route

    }



    // If Passport session exists (i.e., user logged in via Google OAuth), proceed

    if (req.user) {

      return next(); // Proceed if user is found in the session

    }



  } catch (error) {

    return res.status(400).json({ message: "Invalid token. Access denied." });

  }

};



module.exports = isLoggedIn;
