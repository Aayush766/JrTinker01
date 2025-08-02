const mongoose = require("mongoose");

const summerCampEnrollmentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    selectedCamp: {
      type: String,
      required: true,
      enum: ["Junior Camp", "Senior Camp"], // Ensure only valid camp titles are stored
    },
    selectedSession: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const SummerCampEnrollment = mongoose.model("SummerCampEnrollment", summerCampEnrollmentSchema);
module.exports = SummerCampEnrollment;