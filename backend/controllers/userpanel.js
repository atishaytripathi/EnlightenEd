const mongoose = require('mongoose');
const Course = require('../models/Course');
const Topic = require('../models/topic');

exports.getCourseByField = async (req, res) => {
    try {
      const field = req.params.field;
      const course = await Course.find({field: req.params.field});
      if (!course) {
        return res.status(404).send({ error: 'Course not found' });
      }
      res.status(200).send(course);
    } catch (error) {
      res.status(400).send(error);
    }
  };

exports.getField = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).send(courses);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTopicsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Topic.find({relatedCourses: courseId});
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    if (!course || course.length === 0) {
      return res.status(404).send({ error: 'No topics found for this course' });
    }
    res.status(200).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getCourseById = async (req, res) => {
  try {
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