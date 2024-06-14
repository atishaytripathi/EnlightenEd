const express = require("express")
const router = express.Router()
const { createCourseProgress, getCourseProgress, updateCourseProgress, deleteCourseProgress, getEnrolledCourses } = require("../controllers/courseprogress")

router.post('/createCourseProgress/:userId/:courseId', createCourseProgress);
router.get('/getCourseProgress/:userId/:courseId', getCourseProgress);
router.put('/updateCourseProgress/:userId/:courseId', updateCourseProgress);
router.delete('/deleteCourseProgress/:userId/:courseId', deleteCourseProgress);
router.get('/getEnrolledCourses/:userId', getEnrolledCourses);

module.exports = router