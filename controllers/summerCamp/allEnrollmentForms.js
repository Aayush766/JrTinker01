// controllers/summerCamp/allEnrollmentForms.js
const EnrollmentForm = require('../../models/SummerCampEnrollment.model'); // Assuming you have this model

const allEnrollmentForms = async (req, res) => {
  try {
    const forms = await EnrollmentForm.find({}).sort({ createdAt: -1 }); // Fetch all forms, sorted by most recent
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching enrollment forms:", error);
    res.status(500).json({ message: "Server error while fetching forms." });
  }
};

module.exports = allEnrollmentForms;