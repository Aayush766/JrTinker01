const Course = require("../models/course.model.js");

const totalCourses = async (req,res)=>{
    try {
        const courses = await Course.find();
        return res.status(200).json({courses:courses})
        
    } catch (error) {
        console.log("course error:",error);
        return res.status(500).json({message:"Server error",error:error.message})
    }
}

module.exports = totalCourses;  