const Logout = (req, res) => {
    try {
      // Clear the JWT cookie
      console.log("req logout is: ",req)
      res.clearCookie('jwt-intern-token', {
        httpOnly: true, // Cookie cannot be accessed by client-side JavaScript
        // secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
        secure: false,
        maxAge: 0, // Set the cookie expiration to 0 to immediately remove it
      });
  
      return res.status(200).json({ message: 'Logged out backend successfully.' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ message: 'An error occurred while logging out' });
    }
  };
  

module.exports = Logout