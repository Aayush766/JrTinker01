const teacherModel = require("../models/Teacher")


const allTeachers = async(req,res)=>{
    try {
        
        const teachers = await teacherModel.find()

        return res.status(200).json(teachers)

    } catch (error) {
        console.log("all teacher error: ",error)
        res.status(500).json({message:"Internal server error"})
    }
}

module.exports = allTeachers