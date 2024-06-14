const express = require("express")
const { createCourse, createTopic, getCourses, getCourseById, getTopicsByCourse, getTopics,
        getTopicById, deleteCourse, deleteTopic, editCourse, editTopic} = require("../controllers/adminpanel")
const { check } = require('express-validator')
const router = express.Router()

router.post('/createCourse', [] ,createCourse)
router.post('/createTopic/:courseId', [] ,createTopic)

router.get('/getCourses',[], getCourses);
router.get('/getCourseById/:courseId',[], getCourseById);
router.get('/getTopics',[], getTopics);
router.get('/getTopicsByCourse/:courseId',[], getTopicsByCourse);
router.get('/getTopicById/:topicId',[], getTopicById);

router.delete('/deleteCourse/:courseId',[], deleteCourse);
router.delete('/deleteTopic/:topicId',[], deleteTopic);

router.put('/editCourse/:courseId',[], editCourse);
router.put('/editTopic/:courseId/topics/:topicId',[], editTopic);

module.exports = router