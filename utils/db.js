const mongoose = require("mongoose");
const URI = process.env.MONGODB_URI

const dbConnection =async()=>{
    try {

        await mongoose.connect(`${URI}/jrtinker`);
        
    } catch (error) {
        console.log("db error:",error)
    }
}

module.exports = dbConnection