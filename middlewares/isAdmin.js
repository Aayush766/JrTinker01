// backend/middlewares/isAdmin.js
const isAdmin = (req, res, next) => {
  // checkAuth and/or Passport.js has already run and populated req.user
  if (!req.user) {
    return res.status(401).json({ message: "Access denied. Please login." });
  }

  // Check if the user's role is 'admin'
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Forbidden. You do not have admin access." });
  }

  next();
};

module.exports = isAdmin;