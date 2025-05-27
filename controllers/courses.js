const Course = require("../models/course.model.js");

const createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      courseDuration,
      ageGroup,
      courseImage,
      coursePrice,
      instructorName,
      courseRating,
    } = req.body;
    console.log("req.body: ", req.body);
    // 🔍 Validation
    if (!courseName || !courseDescription || !courseDuration) {
      return res.status(400).json({
        error:
          "Required fields missing: courseName, courseDescription, or courseDuration.",
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

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      courseDuration,
      ageGroup,
      courseImage: courseImage || null,
      coursePrice: coursePrice || null,
      instructorName,
      courseRating: courseRating || null,
    });
    // console.log("new course: ", newCourse);
    //
    return res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.log("course error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create course", error: error.message });
  }
};

module.exports = createCourse;
