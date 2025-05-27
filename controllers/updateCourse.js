const Course = require("../models/course.model.js");

const updateCourse = async (req, res) => {
    try {
        const {
            id,
            courseName,
            courseDescription,
            courseDuration,
            ageGroup,
            courseImage,
            coursePrice,
            instructorName,
            courseRating
        } = req.body;

        console.log("req.body :",req.body)
        // Check if the course exists
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Validate required fields
        if (
            !courseName ||
            !courseDescription ||
            !courseDuration ||
            !ageGroup ||
            typeof ageGroup.min !== "number" ||
            typeof ageGroup.max !== "number" ||
            !instructorName
        ) {
            return res.status(400).json({ message: "Required fields are missing or invalid" });
        }

        // Update the course
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            {
                courseName,
                courseDescription,
                courseDuration,
                ageGroup,
                courseImage: courseImage || null,
                coursePrice: coursePrice || null,
                instructorName,
                courseRating: courseRating || null
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Course updated successfully",
            course: updatedCourse
        });

    } catch (error) {
        console.error("Course update error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = updateCourse;