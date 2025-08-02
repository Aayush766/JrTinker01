const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    googleID: {
      type: String,
      unique: true,
      sparse: true, // <- allows multiple documents with null googleID
    },
    profilepic: {
      type: String,
    },
    contactNumber: {
      type: String,
      // required: true,
    },
    bookslot: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookSlot",
        default: null,
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was modified (or is new)
  // And ensure it has a password to hash (for Google logins)
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;