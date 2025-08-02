const userModel = require("../../models/User");

const allUsers = async (req, res) => {
  try {
    const users = await userModel.find().select('-password'); // Fetch all users, but exclude the password hash
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = allUsers;