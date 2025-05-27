const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      
    },
    courseDescription: {
      type: String,
      required: true,
    },
    courseDuration: {
      type: String,
      required: true,
    },
    ageGroup: {
        min: {
          type: Number,
          required: true,
        },
        max: { 
          type: Number,
          required: true,
        } 
      },
    courseImage: {
      type: String,

      default: null,
    },
    coursePrice: {
      type: Number,

      default: null,
    },
    instructorName: {
      type: String,
      required:true
    },
    courseRating: {
      type: Number,

      default: null,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
