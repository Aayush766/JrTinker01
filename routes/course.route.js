// routes/course.route.js
const express = require("express");
const router = express.Router();

// Correctly import the controller functions directly
const totalCourses = require("../controllers/allCourses");
const singleCourse = require("../controllers/singleCourse");

// Public routes for courses
router.get("/", totalCourses); // totalCourses is now a function
router.get("/:slug", singleCourse); // singleCourse is now a function

module.exports = router;