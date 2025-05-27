const FooterContactmodel = require("../../models/FooterContactModel")

const allContactForm = async(req,res)=>{
    try {

        const allFooterContactFormData = await FooterContactmodel.find();

        return res.status(200).json(allFooterContactFormData)
        
    } catch (error) {
        console.log("all school data api error");
        return res.status(500).json({message:"Internal server error"})
    }
}

module.exports = allContactForm