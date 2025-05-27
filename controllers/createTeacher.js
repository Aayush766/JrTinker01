const teacherModel = require("../models/Teacher");

const createTeacher = async (req, res) => {
  const { teachername, subjects, experience, teacherphoto } = req.body; 

  if (!(teachername  && subjects && experience && teacherphoto)) {
    return res.status(400).json({ message: "All fields are require" });
  }

  try {
    // const isTeacherExist = await teacherModel.findOne(email);

    // if (isTeacherExist) {
    //   return res
    //     .status(400)
    //     .json({ message: "Teacher already exist with this email" });
    // }
  
    const newTeacher = await teacherModel.create({
      teachername,
      teacherphoto,
      // email,
      subjects,
      experience,
    });
  
    res.status(200).json({message:"Teacher added"})
    
  } catch (error) {
    console.log("create teacher error",error);
    res.status(500).json({messgae:"Internal server error"})
  }


};


module.exports = createTeacher