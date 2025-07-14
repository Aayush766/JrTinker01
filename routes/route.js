// routes/route.js
const express = require("express");
const router = express.Router();

// Import all your controllers and middleware
const RegisterUser = require("../controllers/register");
const loginUser = require("../controllers/login");
const bookUserSlot = require("../controllers/bookUserSlot");
const isLoggedIn = require("../middlewares/isLoggedIn"); // Assuming you're using this elsewhere
const createCourse = require("../controllers/courses");
const deleteCourse = require("../controllers/deleteCourse");
const updateCourse = require("../controllers/updateCourse");
const totalCourses = require("../controllers/allCourses");
const singleCourse = require("../controllers/singleCourse"); // Correct import
const googleLogin = require("../controllers/googleLogin");
const googleLogout = require("../controllers/googleLogout");
const createTeacher = require("../controllers/createTeacher");
const updateTeacher = require("../controllers/updateTeacher");
const allTeachers = require("../controllers/allTeachers");
const Logout = require("../controllers/logout");
const createUserSlot = require("../controllers/slotbooking/createUserSlot");
const allBookedSlots = require("../controllers/slotbooking/allBookedSlots");
const updateBookedSlot = require("../controllers/slotbooking/updateBookedSlot");
const schoolForm = require("../controllers/school/schoolForm");
const allSchoolData = require("../controllers/school/allSchoolData");
const footerContactForm = require("../controllers/footercontact/footerContactForm");
const allContactForm = require("../controllers/footercontact/allFooterContactForm");


// --- User Authentication & Slot Booking Routes ---
router.post("/register", RegisterUser);
router.post("/login", loginUser);
router.post("/logout", Logout);
router.post("/create-slot-booking", createUserSlot);
// Uncomment and add isLoggedIn middleware if these routes require authentication
// router.post("/slot-booking", isLoggedIn, bookUserSlot);
// router.post("/all-slot-booking", isLoggedIn, allBookedSlots);
// router.post("/update-slot-booking", isLoggedIn, updateBookedSlot);


// --- Admin Course Dashboard Routes ---
router.post("/admin/course-dashboard/create-course", createCourse);
router.get("/admin/course-dashboard/all-courses", totalCourses);
router.post("/admin/course-dashboard/delete-course", deleteCourse);
router.post("/admin/course-dashboard/update-course", updateCourse);
router.get("/admin/course-dashboard/course/:slug", singleCourse); // This line was already correct!
router.post("/admin/course-dashboard/single-course", singleCourse);

// --- Admin Teacher Dashboard Routes ---
router.post("/admin/teacher-dashboard/create-teacher", createTeacher);
router.post("/admin/teacher-dashboard/update-teacher", updateTeacher);
router.get("/admin/teacher-dashboard/all-teacher", allTeachers);


// --- School & Contact Form Routes ---
router.post("/school/add-school-info", schoolForm);
router.get("/school/all-school-info", allSchoolData);

router.post("/contact-us/form", footerContactForm);
router.get("/contact-us/all-form", allContactForm);


// --- Google OAuth API Routes (for internal use by your app, not direct browser access) ---
// Note: The actual Google OAuth login flow (redirect to Google, callback) is handled in app.js
router.get("/api/getUser", googleLogin); // This route might be for getting user info after successful login
router.post("/api/logout-user", googleLogout); // This might be for a custom logout after Google OAuth


module.exports = router;