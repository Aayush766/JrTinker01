const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    // Removed courseDescription and courseImage to be replaced by contentBlocks
    // courseDescription: {
    //   type: String,
    //   required: true,
    // },
    // courseImage: {
    //   type: String,
    //   default: null,
    // },
    
    // ✨ NEW FIELD FOR DYNAMIC CONTENT BLOCKS ✨
    contentBlocks: [
      {
        type: {
          type: String,
          enum: ['paragraph', 'image', 'heading', 'list'], // Define allowed content types
          required: true,
        },
        value: { // For text content (paragraph, heading, list item) or image URL
          type: String,
          required: true,
        },
        alt: { // Optional alt text for images, good for accessibility
          type: String,
        },
        // You can add more specific fields for other block types if needed
      },
    ],

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
      },
    },
    coursePrice: {
      type: Number,
      default: null,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    isDiscounted: {
      type: Boolean,
      default: false,
    },
    instructorName: {
      type: String,
      required: true,
    },
    courseRating: {
      type: Number,
      default: null,
    },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    // ✨ NEW FIELD FOR META DESCRIPTION ✨
    metaDescription: {
        type: String,
        default: "Discover exciting STEM courses for future skills and innovation.", // Provide a sensible default
    },
    // ✨ NEW FIELD FOR META KEYWORDS (Optional but good for SEO) ✨
    metaKeywords: {
        type: String,
        default: "STEM, courses, online learning, innovation, technology, coding",
    },
    // ✨ NEW FIELD FOR META TITLE (Optional, if you want a custom title per course) ✨
    metaTitle: {
        type: String,
        default: "STEM Courses | JRTinker",
    }
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
