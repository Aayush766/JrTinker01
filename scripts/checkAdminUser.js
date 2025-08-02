const mongoose = require("mongoose");
const User = require("../models/User"); // Adjust the path to your User model
require("dotenv").config();

const checkAdminUser = async () => {
  const adminEmail = "admin@jrtinker.com";

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected.");

    const adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      console.log("✅ Admin user found!");
      console.log("User details:", {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
        passwordExists: !!adminUser.password, // Check if the password field is present
      });
    } else {
      console.log("❌ Admin user NOT FOUND.");
      console.log("The user with email 'admin@jrtinker.com' does not exist in the database.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await mongoose.disconnect();
  }
};

checkAdminUser();