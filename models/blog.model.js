// models/blog.model.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [500, "Title cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      // Optional, no 'required: true'
    },
    category: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [900, "Description cannot exceed 300 characters"],
      // Optional, no 'required: true'
    },
    contentBlocks: [
      {
        type: {
          type: String,
          enum: ["paragraph", "image", "heading", "list", "quote", "code"],
          required: true, // Block type itself is still required if a block exists
        },
        value: {
          type: String,
          // REMOVED 'required: true' to make content optional for code, quote, paragraph, heading
          // For other block types like 'image', 'value' is still essentially optional
          // since it's only populated on successful upload.
        },
        alt: {
          type: String,
        },
        level: {
          type: Number,
          min: 1,
          max: 6,
        },
        items: {
          type: [String],
          // REMOVED 'required: true' to make list items optional
        },
      },
    ],
    faqs: [
      {
        question: {
          type: String,
          trim: true,
          // Assuming you want FAQs to be optional if added but empty, remove required: true here if present
          // required: true,
        },
        answer: {
          type: String,
          trim: true,
          // required: true,
        },
      },
    ],
    metaDescription: {
      type: String,
      default: "Read the latest articles and insights on STEM, technology, and education.",
      trim: true,
      maxlength: [400, "Meta description cannot exceed 160 characters"],
    },
    metaKeywords: {
      type: String,
      default: "blog, STEM, education, technology, science, coding, innovation",
      trim: true,
    },
    metaTitle: {
      type: String,
      default: "JRTinker Blog | Latest Articles",
      trim: true,
      maxlength: [70, "Meta title cannot exceed 70 characters"],
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate slug from title if not provided
blogSchema.pre("validate", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;