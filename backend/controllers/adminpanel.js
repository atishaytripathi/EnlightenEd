const mongoose = require('mongoose');
const Course = require('../models/Course');
const Topic = require('../models/topic');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    console.log("Course saved.")
    res.status(201).send(course);
  } catch (error) {
    console.log("Course not saved")
    res.status(400).send(error);
  }
};

// Create a new topic and add it to a specific course
exports.createTopic = async (req, res) => {
  try {
    console.log(req.params)
    const courseId = req.params.courseId;
    const topicData = req.body;
    const topic = new Topic(topicData);
    topic["relatedCourses"] = courseId;
    console.log(topic);
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }

    await topic.save();
    course.topics.push(topic._id);
    await course.save();
    console.log("Topic saved.")
    res.status(201).send(topic);
  } catch (error) {
    console.log("Topic not saved")
    res.status(400).send(error);
  }
};

// Display all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).send(courses);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Display a specific course by ID
exports.getCourseById = async (req, res) => {
  try {
    console.log(req.params)
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    res.status(200).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Display all topics
exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.status(200).send(topics);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Display a specific topic by ID
exports.getTopicById = async (req, res) => {
  try {
    console.log(req.params)
    const topic = await Topic.findById(req.params.topicId);
    if (!topic) {
      return res.status(404).send({ error: 'Topic not found' });//why is this error not throwing for particular case
    }
    
    res.status(200).send(topic);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// Display all topics for a specific course
exports.getTopicsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const topics = await Topic.find({relatedCourses: courseId});
    console.log(topics)
    if (!topics) {
      return res.status(404).send({ error: 'Course not found' });
    }
    // if (!course || course.length === 0) {
    //   return res.status(404).send({ error: 'No topics found for this course' });
    // }
    res.status(200).send(topics);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);
    const topic = await Topic.find({relatedCourses: courseId}).deleteMany();
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }


    res.status(200).send({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a topic by ID for a specific course
exports.deleteTopic = async (req, res) => {
  try {
    // console.log(req.params);
    // const course = await Course.findById(req.params.courseId);
    // if (!course) {
    //   return res.status(404).send({ error: 'Course not found' });
    // }
    
    // const topicIndex = course.topics.indexOf(req.params.topicId);
    // if (topicIndex === -1) {
    //   return res.status(404).send({ error: 'Topic not found in this course' });
    // }

    // course.topics.splice(topicIndex, 1);
    // await course.save();

    await Topic.findByIdAndDelete(req.params.topicId);

    res.status(200).send({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Edit a course by ID
exports.editCourse = async (req, res) => {
  try {
    console.log(req.params)
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true, runValidators: true });
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    res.status(200).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Edit a topic by ID for a specific course
exports.editTopic = async (req, res) => {
  try {
    console.log(req.params);
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }

    const topic = await Topic.findByIdAndUpdate(req.params.topicId, req.body, { new: true, runValidators: true });
    if (!topic) {
      return res.status(404).send({ error: 'Topic not found' });
    }

    // Ensure the topic is part of the course
    if (!course.topics.includes(topic._id)) {
      return res.status(404).send({ error: 'Topic not found in this course' });
    }

    res.status(200).send(topic);
  } catch (error) {
    res.status(400).send(error);
  }
};