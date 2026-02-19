const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Adjust the path to your User model
require("dotenv").config();

const resetAdminPassword = async () => {
  const adminEmail = "admin@jrtinker.com";
  const newAdminPassword = "jr123"; // <--- CHANGE THIS PASSWORD

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected.");

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newAdminPassword, salt);

    // Find the admin user and update their password
    const result = await User.updateOne(
      { email: adminEmail },
      { $set: { password: hashedPassword, role: "admin" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`🎉 Successfully updated password for admin user: ${adminEmail}`);
      console.log(`New Password (hashed): ${hashedPassword}`);
      console.log("You can now log in with the new password you defined in the script.");
    } else {
      console.log(`User with email ${adminEmail} not found. Please create the admin user first.`);
    }
  } catch (error) {
    console.error("Error updating admin password:", error);
  } finally {
    await mongoose.disconnect();
  }
};

resetAdminPassword();