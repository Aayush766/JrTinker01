const userModel = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");


const loginUser = async (req, res) => {
  console.log("req.body login is: ", req.body);
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExist = await userModel.findOne({
      email
    });

    // console.log("userExist: ",userExist)

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    // console.log("password match: ",isPasswordValid)

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: userExist._id, email: userExist.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "12h" }
    );

    res.cookie("jwt-intern-token", token, {
      httpOnly: true, // Prevents access via JavaScript
      secure: false, // Set `true` in production with HTTPS
      sameSite: "strict", // Protects against CSRF attacks
      maxAge: 12 * 60 * 60 * 1000, // Expires in 12 hours
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: userExist._id,
        email: userExist.email,
        username: userExist.username, // Include any other relevant user data
      },
    });
  } catch (error) {
    console.log("login error: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = loginUser;
