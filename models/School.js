const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    schoolName: {
      type: String,
      required: true,
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const School = mongoose.model("School", schoolSchema);

module.exports = School;
