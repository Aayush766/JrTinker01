const SchoolModel = require("../../models/School")

const schoolForm =async (req,res)=>{

    const {name,email,contactNumber,designation,city,schoolName,preferredDate,preferredTime,requirements} = req.body

    console.log("schooldata is: ",req.body)

    if(!name || !email || !contactNumber || !designation || !city || !schoolName || !preferredDate || !preferredTime || !requirements){
        return res.status(400).json({message:"All fields are required"})
    }

    
    try {

        const newSchoolRequirements = await SchoolModel.create({
            name,email,contactNumber,designation,city,schoolName,preferredDate,preferredTime,requirements
        })
        console.log("newSchool: ",newSchoolRequirements)

        return res.status(201).json({message:"Thanyou for collaborating with us. Our team will contact you shortly"})
        
    } catch (error) {
        console.log("school api error: ",error)
        return res.status(500).json({message:"Internal server error"})
    }
}


module.exports = schoolForm