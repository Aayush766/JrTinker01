const mongoose = require("mongoose");
// Import slugify
const slugify = require("slugify"); // <<< ADD THIS

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    // Add the slug field
    slug: {
      type: String,
      unique: true, // Ensure slugs are unique
      index: true, // Add an index for faster lookups
    },
    // ... (rest of your existing fields)
    contentBlocks: [
      {
        type: {
          type: String,
          enum: ["paragraph", "image", "heading", "list"],
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
        },
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
    metaDescription: {
      type: String,
      default: "Discover exciting STEM courses for future skills and innovation.",
    },
    metaKeywords: {
      type: String,
      default: "STEM, courses, online learning, innovation, technology, coding",
    },
    metaTitle: {
      type: String,
      default: "STEM Courses | JRTinker",
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate the slug
courseSchema.pre("save", function (next) {
  if (this.isModified("courseName") || !this.slug) { // Only generate if courseName changes or slug is new
    this.slug = slugify(this.courseName, {
      lower: true,    // Convert to lowercase
      strict: true,   // Remove special characters
      trim: true,     // Trim leading/trailing spaces
    });
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;