const Course = require("../models/course.model.js");

const filterCourse = async(req,res)=>{
    const {prompt} = req.body;
    if(!prompt){
        return res.status(400).json({message:"ENter text please"})
    }

    const courseExist = await Course.find({courseName:prompt})
    return res.status(200).json(courseExist)

}

module.exports = filterCourse