const BookSlotModel = require("../../models/BookSlot")

const allBookedSlots = async (req, res) => {
  try {
    const allSlotsBookings = await BookSlotModel.find();
    return res.status(200).json(allBookedSlots);
  } catch (error) {
    console.log("all booked error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = allBookedSlots;
