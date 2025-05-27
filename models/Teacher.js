const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    teachername: {
        type: String,
        required: true
    },
    // email: {
    //     type: String,
    //     required: true
    // },
    subjects: {
        type: [String],
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    teacherphoto: {
        type: [String],
        required: true
    }
}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
