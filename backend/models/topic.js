const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Topic Schema
const TopicSchema = new Schema({
  title: { type: String, required: true },
  videos: [{ type: String }], // Array of video URLs
  topicNotes: [{ type: String }], // Array of notes URLs or content
  blogs: [{ type: String }], // Array of blog URLs or IDs
  starred: { type: Boolean, default: false },   //mark as starred for user
  checkbox: { type: Boolean, default: false }, // Checkbox field for user
  relatedCourses: {type:String, required:true}
});

// Create and export the Topic model
const Topic = mongoose.model('Topics', TopicSchema);
module.exports = Topic;
