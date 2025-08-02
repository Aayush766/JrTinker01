const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin.js");

// Import all the necessary controllers
const allContactForm = require("../controllers/footercontact/allFooterContactForm");
const allSchoolData = require("../controllers/school/allSchoolData");
const totalCourses = require("../controllers/allCourses");
const allBookedSlots = require("../controllers/slotbooking/allBookedSlots");
const allTeachers = require("../controllers/allTeachers");
const allUsers = require("../controllers/users/allUsers");
// NEW: Import the controller for enrollment forms
const allEnrollmentForms = require("../controllers/summerCamp/allEnrollmentForms"); 

const {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} = require("../controllers/blog.controller.js");

const createCourse = require("../controllers/courses");
const deleteCourse = require("../controllers/deleteCourse");
const updateCourse = require("../controllers/updateCourse");

// All routes in this file will be protected by the `isAdmin` middleware

// --- Routes for fetching all data for the dashboard ---
router.get("/dashboard/courses", isAdmin, totalCourses);
router.get("/dashboard/teachers", isAdmin, allTeachers);
router.get("/dashboard/contact-forms", isAdmin, allContactForm);
router.get("/dashboard/school-forms", isAdmin, allSchoolData);
router.get("/dashboard/booked-slots", isAdmin, allBookedSlots);
router.get("/dashboard/blogs", isAdmin, getAllBlogs);
router.get("/dashboard/users", isAdmin, allUsers);

// NEW: Route to get the total number of enrollment forms for the dashboard
router.get("/dashboard/enrollments", isAdmin, allEnrollmentForms);


// --- Routes for managing blogs (create, update, delete) ---
router.post("/dashboard/blogs", isAdmin, createBlog);
router.put("/dashboard/blogs/:id", isAdmin, updateBlog);
router.delete("/dashboard/blogs/:id", isAdmin, deleteBlog);

// --- Routes for managing courses (create, update, delete) ---
router.post("/dashboard/create-course", isAdmin, createCourse);
router.post("/dashboard/delete-course", isAdmin, deleteCourse);
router.post("/dashboard/update-course", isAdmin, updateCourse);

// NEW: Route to fetch the list of all enrollment forms
router.get("/enrollment-forms", isAdmin, allEnrollmentForms);

// Export the router
module.exports = router;