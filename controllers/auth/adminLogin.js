const User = require("../../models/User.model.js"); // Adjust path if needed
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });

    // 2. Check if the user exists and if their role is 'admin'
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: "Invalid credentials or not an admin." });
    }

    // 3. Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 4. Create a JWT payload and sign a new token
    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    
    // 5. Set the token as an HTTP-only cookie
    res.cookie("jwt-intern-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 3600000, // 1 hour
    });

    // 6. Send a successful response
    res.status(200).json({
      message: "Admin login successful.",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = adminLogin;