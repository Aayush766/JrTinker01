const FooterContactmodel = require("../../models/FooterContactModel")

const footerContactForm =async (req,res)=>{

    const {email,description} = req.body

    console.log("footerContactForm data is: ",req.body)

    if(!email || !description){
        return res.status(400).json({message:"All fields are required"})
    }

    
    try {

        const newConatctForm = await FooterContactmodel.create({
            email,description
        })
        console.log("footerContactForm: ",newConatctForm)

        return res.status(201).json({message:"Thanyou for emailing us. Our team will contact you shortly"})
        
    } catch (error) {
        console.log("school api error: ",error)
        return res.status(500).json({message:"Internal server error"})
    }
}


module.exports = footerContactForm