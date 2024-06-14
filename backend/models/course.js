const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Course Schema
const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  logo: { type: String, required: true },
  field : { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  topics: [{ type: Schema.Types.ObjectId, ref: 'Topic' }] // Array of references to Topic
});

// Create and export the Course model
const Course = mongoose.model('Courses', CourseSchema);
module.exports = Course;
