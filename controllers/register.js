const express = require("express");
const userModel = require("../models/User");

const bcrypt = require("bcryptjs");


const RegisterUser = async (req, res) => {
  console.log("req.body",req.body)
  const { username, email, password, contactNumber } = req.body;
  if (!(username && email && password && contactNumber)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExist = await userModel.findOne({
        email 
      });
      
    if (userExist) {
      return res.status(400).json({ message: "user already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createUser = await userModel.create({
      username,
      email,
      password: hashPassword,
      contactNumber,
    });

    res.status(200).json({ message: "User created succesfull" });
  } catch (error) {
    console.log("registartion error: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = RegisterUser;
