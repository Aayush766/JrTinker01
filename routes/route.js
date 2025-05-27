const express = require("express");
const router = express.Router()
const RegisterUser = require("../controllers/register")
const loginUser = require("../controllers/login");
const bookUserSlot = require("../controllers/bookUserSlot");
const isLoggedIn = require("../middlewares/isLoggedIn");
const createCourse = require("../controllers/courses"); 
const deleteCourse = require("../controllers/deleteCourse");
const updateCourse = require("../controllers/updateCourse");
const totalCourses = require("../controllers/allCourses");
const singleCourse = require("../controllers/singleCourse");
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

 


router.post("/register",RegisterUser);  
router.post("/login",loginUser);
router.post("/logout",Logout); 
// router.post("/slot-booking",isLoggedIn,bookUserSlot)
router.post("/create-slot-booking",createUserSlot)
// router.post("/all-slot-booking",isLoggedIn,allBookedSlots)
// router.post("/update-slot-booking",isLoggedIn,updateBookedSlot)


router.post("/admin/course-dashboard/create-course",createCourse)
router.get("/admin/course-dashboard/all-courses",totalCourses)
router.post("/admin/course-dashboard/delete-course",deleteCourse)
router.post("/admin/course-dashboard/update-course",updateCourse)
router.post("/admin/course-dashboard/single-course",singleCourse)


router.post("/admin/teacher-dashboard/create-teacher",createTeacher)
router.post("/admin/teacher-dashboard/update-teacher",updateTeacher)
router.get("/admin/teacher-dashboard/all-teacher",allTeachers)



router.post("/school/add-school-info",schoolForm)
router.get("/school/all-school-info",allSchoolData);

router.post("/contact-us/form",footerContactForm);
router.get("/contact-us/all-form",allContactForm);


router.get("/api/getUser",googleLogin)
router.post("/api/logout-user",googleLogout)


module.exports = router