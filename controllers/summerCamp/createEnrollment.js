const SummerCampEnrollment = require("../../models/SummerCampEnrollment.model");

const createEnrollment = async (req, res) => {
  try {
    const { studentName, parentName, email, phoneNumber, selectedCamp, selectedSession, message } = req.body;

    // Basic validation
    if (!studentName || !parentName || !email || !phoneNumber || !selectedCamp || !selectedSession) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // Create a new enrollment document
    const newEnrollment = new SummerCampEnrollment({
      studentName,
      parentName,
      email,
      phoneNumber,
      selectedCamp,
      selectedSession,
      message,
    });

    // Save the document to the database
    await newEnrollment.save();
    
    console.log("New summer camp enrollment created:", newEnrollment);
    res.status(201).json({ message: "Enrollment submitted successfully!", data: newEnrollment });

  } catch (error) {
    console.error("Error creating enrollment:", error);
    res.status(500).json({ message: "An error occurred while processing your enrollment. Please try again later." });
  }
};

module.exports = createEnrollment;