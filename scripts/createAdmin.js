const mongoose = require("mongoose");
const User = require("../models/User"); // Adjust the path
require("dotenv").config();

console.log("Using MONGODB_URI:", process.env.MONGODB_URI); // ADDED: Log the database URI

const createAdminUser = async () => {
  const adminUsername = "adminuser";
  const adminEmail = "admin@jrtinker01.com";
  const adminPassword = "jrt123";

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully.");

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists. Skipping creation.`);
      await mongoose.disconnect();
      return;
    }

    const newAdmin = new User({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    await newAdmin.save();
    console.log("🎉 Admin user created successfully!");
    console.log(`Username: ${adminUsername}`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password (plain text used for creation): ${adminPassword}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser();