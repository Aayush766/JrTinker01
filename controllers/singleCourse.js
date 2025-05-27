const Course = require("../models/course.model.js");

const singleCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if(!courseId){
      return res.status(404).json({ message: "Course id required " });
    }
    const course = await Course.findById({_id:courseId});
    // console.log("cpurse:",course)
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ course: course });
  } catch (error) {
    console.log("error in singleCourse: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}; 


module.exports = singleCourse;