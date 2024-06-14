const TopicProgress = require('../models/topicprogress');

// Create Topic Progress
exports.createTopicProgress = async (req, res) => {
    try {
        const topicProgress = await TopicProgress.findOne({
            userId: req.params.userId,
            courseId: req.params.courseId,
            topicId: req.params.topicId
        })
        if (topicProgress) {
            // console.log('Topic in progress.')
            return res.status(200).json({enrolled:true, message: 'Topic in progress.', record: {topicProgress} });
        } else {
            const topicProgressNew = new TopicProgress({
                userId: req.params.userId, 
                courseId: req.params.courseId,
                topicId: req.params.topicId
            });
            await topicProgressNew.save();
            // console.log(topicProgressNew);
            res.status(201).json(topicProgressNew);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//get all topic progresses by userid and courseid
exports.getAllTopicProgresses = async (req, res) => {
    try {
        const topicProgresses = await TopicProgress.find({
            userId: req.params.userId,
            courseId: req.params.courseId
        })
        if(!topicProgresses) {
            return res.status(404).json({message: 'No topics in progress.'})
        }
        res.json(topicProgresses);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Get Topic Progress by userId, courseId, and topicId
exports.getTopicProgress = async (req, res) => {
    try {
        const topicProgress = await TopicProgress.findOne({
            userId: req.params.userId,
            courseId: req.params.courseId,
            topicId: req.params.topicId
        }).populate('courseId').populate('userId').populate('topicId');
        if (!topicProgress) {
            return res.status(404).json({ message: 'Topic Progress not found' });
        }
        res.json(topicProgress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Topic Progress by userId, courseId, and topicId
exports.updateTopicProgress = async (req, res) => {
    try {
        const topicProgress = await TopicProgress.findOneAndUpdate(
            { userId: req.params.userId, courseId: req.params.courseId, topicId: req.params.topicId },
            req.body,
            { new: true }
        );
        if (!topicProgress) {
            return res.status(404).json({ message: 'Topic Progress not found' });
        }
        console.log(topicProgress)
        res.json(topicProgress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Topic Progress by userId, courseId, and topicId
exports.deleteTopicProgress = async (req, res) => {
    try {
        const topicProgress = await TopicProgress.findOneAndDelete({
            userId: req.params.userId,
            courseId: req.params.courseId,
            topicId: req.params.topicId
        });
        if (!topicProgress) {
            return res.status(404).json({ message: 'Topic Progress not found' });
        }
        res.json({ message: 'Topic Progress deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
