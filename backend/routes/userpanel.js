const express = require("express");
const { getCourseByField, getField, getTopicsByCourse, getCourseById } = require("../controllers/userpanel");
const router = express.Router()

router.get('/getCourseByField/:field',[], getCourseByField);
router.get('/getField',[], getField)
router.get('/getTopicsByCourse/:courseId', [], getTopicsByCourse);
router.get('/getCourseByCourseId/:courseId', [], getCourseById)

module.exports = router;