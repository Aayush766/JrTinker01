const SchoolModel = require("../../models/School")

const allSchoolData = async(req,res)=>{
    try {

        const allSchoollInfo = await SchoolModel.find();

        return res.status(200).json(allSchoollInfo)
        
    } catch (error) {
        console.log("all school data api error");
        return res.status(500).json({message:"Internal server error"})
    }
}

module.exports = allSchoolData