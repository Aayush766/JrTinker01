
const mongoose = require('mongoose');

const BookSlotSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
  },
  courseTakenBy: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('BookSlot', BookSlotSchema);
