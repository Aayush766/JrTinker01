const Course = require("../models/course.model.js");

const updateCourse = async (req, res) => {
  try {
    const {
      id,
      courseName,
      // Removed courseDescription and courseImage from destructuring
      // courseDescription,
      // courseImage,
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
      // ✨ NEW FIELD IN REQ.BODY ✨
      contentBlocks, 
    } = req.body;

    console.log("req.body :", req.body);
    // Check if the course exists
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Validate required fields (consider making this more granular)
    if (
      !courseName ||
      // Removed validation for courseDescription
      // !courseDescription || 
      !courseDuration ||
      !ageGroup ||
      typeof ageGroup.min !== "number" ||
      typeof ageGroup.max !== "number" ||
      !instructorName
    ) {
      return res.status(400).json({ message: "Required fields are missing or invalid" });
    }

    // Validate ageGroup logic
    if (ageGroup.min > ageGroup.max) {
      return res.status(400).json({ error: "Minimum age cannot be greater than maximum age." });
    }

    // Price validation
    if (typeof coursePrice !== 'number' || coursePrice < 0) {
      return res.status(400).json({ error: "Course price must be a non-negative number." });
    }

    // Validate originalPrice if a discount is applied
    if (isDiscounted) {
      if (typeof originalPrice !== 'number' || originalPrice <= 0) {
        return res.status(400).json({
          error: "Original price must be a positive number when discounted."
        });
      }
      if (originalPrice <= coursePrice) {
        return res.status(400).json({
          error: "Original price must be greater than course price when discounted."
        });
      }
    } else {
      if (originalPrice && originalPrice !== coursePrice) {
        return res.status(400).json({
          error: "Original price should match course price or be absent when not discounted."
        });
      }
    }

    // --- NEW VALIDATION FOR contentBlocks ---
    if (!contentBlocks || !Array.isArray(contentBlocks) || contentBlocks.length === 0) {
      return res.status(400).json({ error: "Content blocks array is required and cannot be empty." });
    }
    for (const block of contentBlocks) {
      if (typeof block !== 'object' || !block.type || !block.value) {
        return res.status(400).json({ error: "Each content block must be an object with 'type' and 'value'." });
      }
      // Optional: Add more specific validation based on block.type if needed
      // E.g., if block.type === 'image', ensure block.value is a valid URL
    }
    // --- END NEW VALIDATION FOR contentBlocks ---


    // --- NEW VALIDATION FOR FAQS (Optional, but good practice) ---
    if (faqs !== undefined && !Array.isArray(faqs)) { // Check if faqs is provided and not an array
      return res.status(400).json({ error: "FAQs must be an array if provided." });
    }
    if (faqs) { // If faqs array is provided, validate its contents
      for (const faq of faqs) {
        if (typeof faq !== 'object' || !faq.question || !faq.answer) {
          return res.status(400).json({ error: "Each FAQ must be an object with 'question' and 'answer'." });
        }
      }
    }

    if (metaDescription !== undefined && typeof metaDescription !== 'string') {
        return res.status(400).json({ error: "Meta description must be a string if provided." });
    }
    if (metaKeywords !== undefined && typeof metaKeywords !== 'string') {
        return res.status(400).json({ error: "Meta keywords must be a string if provided." });
    }
    if (metaTitle !== undefined && typeof metaTitle !== 'string') {
        return res.status(400).json({ error: "Meta title must be a string if provided." });
    }
    // --- END NEW VALIDATION ---

    // Prepare update object
    const updateFields = {
      courseName,
      // Removed courseDescription and courseImage from updateFields
      // courseDescription,
      // courseImage,
      courseDuration,
      ageGroup,
      coursePrice,
      originalPrice: isDiscounted ? originalPrice : coursePrice,
      isDiscounted,
      instructorName,
      // ✨ ADD contentBlocks to updateFields ✨
      contentBlocks, 
    };

    // Conditionally update courseRating if provided
    if (courseRating !== undefined) {
      updateFields.courseRating = courseRating;
    }

    // Conditionally update faqs if provided
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
    
    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateFields, // Use the prepared updateFields object
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });

  } catch (error) {
    console.error("Course update error:", error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = updateCourse;
