const teacherModel = require("../models/Teacher");

const updateTeacher = async (req, res) => {
  const { id } = req.body;

  try {
    const isTeacherExist = await teacherModel.findById({ _id: id });

    if (!isTeacherExist) {
      return res.status(400).json({ message: "Teacher not exist" });
    }
    const { teachername, email, subjects, experience, teacherphoto } = req.body;

    if (!(teachername && email && subjects && experience && teacherphoto)) {
      return res.status(400).json({ message: "All fields are require" });
    }

    const updateTeacherInfo = await teacherModel.findByIdAndUpdate(
      id,
      {
        teachername,
        email,
        subjects,
        experience,
        teacherphoto,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Teacher updated successfully",
    });
  } catch (error) {
    console.log("update teacher error", error);
    res.status(500).json({ messgae: "Internal server error" });
  }
};

module.exports = updateTeacher;
