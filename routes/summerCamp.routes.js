const router = require('express').Router();
const createEnrollment = require('../controllers/summerCamp/createEnrollment');

// Define the route to handle enrollment form submissions
router.post('/enroll', createEnrollment);

module.exports = router;