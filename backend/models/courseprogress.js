const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseProgressSchema = new Schema({
  userId: { type:Schema.Types.ObjectId, ref:'Users', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Courses', required: true },
  totalTopics: { type: Number, default: 0 },
  completedTopicsCount: { type: Number, default: 0 },
  completionPercentage: { type: Number, default: 0 },
  topicProgress: [{ type: Schema.Types.ObjectId, ref:'topicprogess' }],
  });


const CourseProgress = mongoose.model('CourseProgress', CourseProgressSchema);
module.exports = CourseProgress;