const Course = require("../models/course.model.js");

const createCourse = async (req, res) => {
  try {
    const {
      courseName,
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
      contentBlocks, // Ensure contentBlocks is destructured
    } = req.body;
    console.log("req.body: ", req.body);

    // 🔍 Validation
    if (!courseName || !courseDuration) {
      return res.status(400).json({
        error: "Required fields missing: courseName or courseDuration.",
      });
    }

    if (
      !ageGroup ||
      typeof ageGroup.min !== "number" ||
      typeof ageGroup.max !== "number"
    ) {
      return res
        .status(400)
        .json({ error: "Age group must include numeric min and max values." });
    }

    if (ageGroup.min > ageGroup.max) {
      return res
        .status(400)
        .json({ error: "Minimum age cannot be greater than maximum age." });
    }

    // Optional: Add validation for originalPrice if isDiscounted is true
    if (isDiscounted && (!originalPrice || typeof originalPrice !== 'number' || originalPrice <= coursePrice)) {
      return res.status(400).json({
        error: "Original price must be a number greater than course price when discounted.",
      });
    }

    // --- VALIDATION FOR contentBlocks ---
    if (!contentBlocks || !Array.isArray(contentBlocks) || contentBlocks.length === 0) {
        return res.status(400).json({ error: "Content blocks array is required and cannot be empty." });
    }
    for (const block of contentBlocks) {
        if (typeof block !== 'object' || !block.type || !block.value) {
            return res.status(400).json({ error: "Each content block must be an object with 'type' and 'value'." });
        }
        // Optional: Add more specific validation based on block.type if needed
    }
    // --- END VALIDATION FOR contentBlocks ---

    // --- NEW VALIDATION FOR FAQS (Optional, but good practice) ---
    if (faqs && !Array.isArray(faqs)) {
      return res.status(400).json({ error: "FAQs must be an array." });
    }
    if (faqs) {
      for (const faq of faqs) {
        if (!faq.question || !faq.answer) {
          return res.status(400).json({ error: "Each FAQ must have a 'question' and 'answer'." });
        }
      }
    }

    if (metaDescription && typeof metaDescription !== 'string') {
        return res.status(400).json({ error: "Meta description must be a string." });
    }
    if (metaKeywords && typeof metaKeywords !== 'string') {
        return res.status(400).json({ error: "Meta keywords must be a string." });
    }
    if (metaTitle && typeof metaTitle !== 'string') {
        return res.status(400).json({ error: "Meta title must be a string." });
    }
    // --- END NEW VALIDATION ---

    const newCourse = await Course.create({
      courseName,
      courseDuration,
      ageGroup,
      coursePrice: coursePrice || null,
      originalPrice: originalPrice || null,
      isDiscounted: isDiscounted || false,
      instructorName,
      courseRating: courseRating || null,
      faqs: faqs || [],
      metaDescription: metaDescription || undefined,
      metaKeywords: metaKeywords || undefined,
      metaTitle: metaTitle || undefined,
      contentBlocks, // Pass contentBlocks to the create method
    });

    return res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.log("course error:", error);
    // Mongoose validation errors for subdocuments will be caught here too
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    return res
      .status(500)
      .json({ message: "Failed to create course", error: error.message });
  }
};

module.exports = createCourse;
