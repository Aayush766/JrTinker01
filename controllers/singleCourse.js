// controllers/singleCourse.js
const Course = require("../models/course.model.js");

const singleCourse = async (req, res) => {
  try {
    // Get the slug from URL parameters
    const { slug } = req.params;

    // This check is a bit redundant if your route definition is strict,
    // but it adds an extra layer of explicit validation.
    if (!slug) {
      return res.status(400).json({ message: "Course slug is required in the URL." });
    }

    // Find the course by its slug
    const course = await Course.findOne({ slug: slug });

    if (!course) {
      // If no course is found, return a 404 Not Found with a JSON message
      return res.status(404).json({ message: "Course not found." });
    }

    // If course is found, return it with a 200 OK status
    return res.status(200).json({ course: course });
  } catch (error) {
    // Log the detailed error on the server side for debugging
    console.error("Error in singleCourse controller:", error);

    // Return a 500 Internal Server Error with a helpful message
    return res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = singleCourse;