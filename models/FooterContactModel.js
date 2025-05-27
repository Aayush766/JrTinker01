const mongoose = require("mongoose");

const FooterContactSchema = new mongoose.Schema(
  {
  
    email: {
      type: String,
      required: true,
    },
   
    description: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const FooterContact = mongoose.model("FooterContact", FooterContactSchema);

module.exports =FooterContact ;
