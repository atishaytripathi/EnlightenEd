const Course = require('../models/Course');
const CourseProgress = require('../models/courseprogress');

// Create Course Progress
exports.createCourseProgress = async (req, res) => {
    try {
        // console.log(req.params)
        const courseProgress = await CourseProgress.findOne({
            userId: req.params.userId,
            courseId: req.params.courseId
        })
        if (courseProgress) {
            console.log('Course already enrolled.')
            return res.status(200).json({enrolled:true, message: 'Course already enrolled.', record: {courseProgress} });
        } else {
            const courseProgressNew = new CourseProgress({userId: req.params.userId, courseId: req.params.courseId});
            await courseProgressNew.save();
            console.log(courseProgressNew);
            res.status(201).json(courseProgressNew);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Course Progress by userId and courseId
exports.getCourseProgress = async (req, res) => {
    try {
        // console.log(req.params,'params');
        const courseProgress = await CourseProgress.findOne({
            userId: req.params.userId,
            courseId: req.params.courseId
        });
        console.log(courseProgress)
        if (!courseProgress) {
            return res.status(404).json({ message: 'Course Progress not found' });
        }
        res.json(courseProgress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Course Progress by userId and courseId
exports.updateCourseProgress = async (req, res) => {
    try {
        const courseProgress = await CourseProgress.findOneAndUpdate(
            { userId: req.params.userId, courseId: req.params.courseId },
            req.body,
            { new: true }
        );
        if (!courseProgress) {
            return res.status(404).json({ message: 'Course Progress not found' });
        }
        res.json(courseProgress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Course Progress by userId and courseId
exports.deleteCourseProgress = async (req, res) => {
    try {
        const courseProgress = await CourseProgress.findOneAndDelete({
            userId: req.params.userId,
            courseId: req.params.courseId
        });
        if (!courseProgress) {
            return res.status(404).json({ message: 'Course Progress not found' });
        }
        res.json({ message: 'Course Progress deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getEnrolledCourses = async (req, res) =>{
    try{
        const courseprogress = await CourseProgress.find({
            userId: req.params.userId
        })
        const courseIds = courseprogress.map((object) => {
            return(object.courseId);
        })
        const courses = await Course.find({
           _id: { $in: courseIds} 
        })
        if(!courses){
            return res.status(404).json({ message:'No courses enrolled.'});
        }
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
