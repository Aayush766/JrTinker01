const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      
    },
    googleID: {
      type: String,
      unique: true,
      sparse: true, // <- allows multiple documents with null googleID

    },
    profilepic: { 
      type: String,
      
    },
    
    contactNumber: {
      type: String,
      // required: true,
    },
    bookslot: [
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"BookSlot",
        default:null
      }
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
