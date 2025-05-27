const googleLogout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to destroy session" });
      }

      res.clearCookie('connect.sid'); // optional: clear session cookie
      res.status(200).json({ message: "Logout Google successful" });
    });
  });
};


 
module.exports = googleLogout