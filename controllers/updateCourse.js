// controllers/updateCourse.js
const Course = require("../models/course.model.js");
// No need to import slugify here if handled by model's pre-save hook

const updateCourse = async (req, res) => {
  try {
    const {
      id,
      courseName, // Keep courseName in destructuring
      courseDuration,
      ageGroup,
      coursePrice,
      originalPrice,
      isDiscounted,
      instructorName,
      courseRating,
      faqs,
      metaDescription,
      metaKeywords,
      metaTitle,
      contentBlocks,
    } = req.body;

    console.log("req.body :", req.body);
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      !courseName ||
      !courseDuration ||
      !ageGroup ||
      typeof ageGroup.min !== "number" ||
      typeof ageGroup.max !== "number" ||
      !instructorName
    ) {
      return res
        .status(400)
        .json({ message: "Required fields are missing or invalid" });
    }

    if (ageGroup.min > ageGroup.max) {
      return res
        .status(400)
        .json({ error: "Minimum age cannot be greater than maximum age." });
    }

    if (typeof coursePrice !== "number" || coursePrice < 0) {
      return res
        .status(400)
        .json({ error: "Course price must be a non-negative number." });
    }

    if (isDiscounted) {
      if (typeof originalPrice !== "number" || originalPrice <= 0) {
        return res.status(400).json({
          error: "Original price must be a positive number when discounted.",
        });
      }
      if (originalPrice <= coursePrice) {
        return res.status(400).json({
          error:
            "Original price must be greater than course price when discounted.",
        });
      }
    } else {
      if (originalPrice && originalPrice !== coursePrice) {
        return res.status(400).json({
          error:
            "Original price should match course price or be absent when not discounted.",
        });
      }
    }

    if (
      !contentBlocks ||
      !Array.isArray(contentBlocks) ||
      contentBlocks.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Content blocks array is required and cannot be empty." });
    }
    for (const block of contentBlocks) {
      if (typeof block !== "object" || !block.type || !block.value) {
        return res.status(400).json({
          error: "Each content block must be an object with 'type' and 'value'.",
        });
      }
    }

    if (faqs !== undefined && !Array.isArray(faqs)) {
      return res.status(400).json({ error: "FAQs must be an array if provided." });
    }
    if (faqs) {
      for (const faq of faqs) {
        if (typeof faq !== "object" || !faq.question || !faq.answer) {
          return res.status(400).json({
            error: "Each FAQ must be an object with 'question' and 'answer'.",
          });
        }
      }
    }

    if (metaDescription !== undefined && typeof metaDescription !== "string") {
      return res.status(400).json({ error: "Meta description must be a string if provided." });
    }
    if (metaKeywords !== undefined && typeof metaKeywords !== "string") {
      return res.status(400).json({ error: "Meta keywords must be a string if provided." });
    }
    if (metaTitle !== undefined && typeof metaTitle !== "string") {
      return res.status(400).json({ error: "Meta title must be a string if provided." });
    }

    const updateFields = {
      courseName,
      courseDuration,
      ageGroup,
      coursePrice,
      originalPrice: isDiscounted ? originalPrice : coursePrice,
      isDiscounted,
      instructorName,
      contentBlocks,
    };

    if (courseRating !== undefined) {
      updateFields.courseRating = courseRating;
    }

    if (faqs !== undefined) {
      updateFields.faqs = faqs;
    }

    if (metaDescription !== undefined) {
      updateFields.metaDescription = metaDescription;
    }
    if (metaKeywords !== undefined) {
      updateFields.metaKeywords = metaKeywords;
    }
    if (metaTitle !== undefined) {
      updateFields.metaTitle = metaTitle;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true } // runValidators is crucial for pre-save hook to fire
    );

    return res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Course update error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    // Handle duplicate key error for slug specifically
    if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
        return res.status(409).json({ message: "Course name already exists. Please choose a unique name.", error: error.message });
    }
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = updateCourse;