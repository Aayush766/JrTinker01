const Course = require("../models/course.model.js");

const deleteCourse = async (req,res)=>{
    try {
        const {id} = req.body;
        const course = await Course.findById({_id:id});
        if(!course){
            return res.status(400).json({message:"Course not found"})
        }
        await Course.findByIdAndDelete({_id:id});
        return res.status(200).json({message:"Course deleted successfully"})
        
    } catch (error) {
        console.log("course error:",error);
        return res.status(500).json({message:"Server error",error:error.message})
    }
}

module.exports = deleteCourse;