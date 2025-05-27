const userModel = require("../models/User");

const googleLogin =(req,res)=>{
    // console.log("google login req.body: ",req.user)
    if(req.user){
        return res.status(200).json({message:"Login Successful with google ", user:req.user})
    }else{
        return res.status(400).json({message:"User not authorized"})
    }
}

module.exports = googleLogin 