const userModel = require("../models/User");
const sendMail = require("../utils/sendMail");

const bookUserSlot = async (req, res) => { 
  const { date, time,courseName,userName,email,contactNumber } = req.body.bookingDetails;
  const user = req.user;
  console.log("user got:",user)
  console.log("date: ",date);
  console.log("time: ",time) 
  console.log("courseName:",courseName)
  console.log("userName: ",userName);
  console.log("email: ",email) 
  console.log("contactNumber: ",contactNumber)
  if (!(date && time && courseName && userName && email && contactNumber)) {
    return res.status(400).json({ message: "fill all details" });
  }
  try {
    const userExist = await userModel.findById(user?.id );
    if (!userExist) {
        return res.status(404).json({ message: "Login please" });
      }

      console.log("user exist: ",userExist)

    // userExist.bookslot.push({ date, time,courseName:courseName });
    // userExist.bookslot.courseTakenBy.push({username: userName,email:email,contactnumber:contactNumber});
    userExist.bookslot.push({
      courseName, 
      date, 
      time,
      courseTakenBy: [
        {
          username: userName,
          email: email,
          contactnumber: contactNumber,
        },
      ],
    });
  
    await userExist.save();

    await sendMail(date,time,userExist.email,userName,courseName)
    res.status(200).json({ message: "Slot booked ", userExist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Slot not booked", error: error.message });
  }
};

module.exports = bookUserSlot;
