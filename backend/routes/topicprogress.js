const express = require("express")
const router = express.Router()
const { createTopicProgress, getTopicProgress, updateTopicProgress, deleteTopicProgress, getAllTopicProgresses }= require("../controllers/topicprogress")

router.post('/createTopicProgress/:userId/:courseId/:topicId', createTopicProgress);
router.get('/getTopicProgress/:userId/:courseId/:topicId', getTopicProgress);
router.put('/updateTopicProgress/:userId/:courseId/:topicId', updateTopicProgress);
router.delete('/deleteTopicProgress/:userId/:courseId/:topicId', deleteTopicProgress);
router.get('/getAllTopicProgresses/:userId/:courseId', getAllTopicProgresses)

module.exports = router