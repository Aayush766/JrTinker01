const BookSlotModel = require("../../models/BookSlot")

const updateBookedSlot =async (req,res)=>{
 try {
    const updateSlot = await BookSlotModel.findByIdAndUpdate(
        req.params.id,
        {$push:{bookslot: req.body}},
        {new: true}
    )
    return res.status(200).json({message:"Slot updated successfully",updateSlot})
  } catch (error) {
    console.log("all booked error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = updateBookedSlot