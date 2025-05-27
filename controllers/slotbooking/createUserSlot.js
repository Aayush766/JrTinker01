
const BookSlotModel = require("../../models/BookSlot");
const CourseModel = require("../../models/course.model");
const sendMail = require("../../utils/sendMail");

const createUserSlot = async (req, res) => {
  const { courseName, date, time, userName, email, contactNumber } = req.body;

  const courseExist = await CourseModel.findOne({ courseName });

  if (!courseExist) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const today = new Date();
  const inputDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    return res.status(400).json({ message: "You selected an invalid date" });
  }

  const allowedTimeSlots = ['10:00AM', '11:00AM', '12:00PM', '1:00PM', '2:00PM'];
  if (!allowedTimeSlots.includes(time)) {
    return res.status(400).json({ message: "Please select a valid time slot" });
  }

  try {
    const newSlot = await BookSlotModel.create({
      course: courseName,
      courseTakenBy: userName,
      email,
      date,
      time,
      contactNumber,
    });

    await sendMail(date, time, email, userName, courseName);

    return res.status(201).json({ message: "Slot booked successfully", data: newSlot });
  } catch (error) {
    console.error("Slot creation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = createUserSlot;
