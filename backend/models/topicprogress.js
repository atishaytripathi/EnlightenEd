const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref:'Users', required: true },
  courseId: { type: Schema.Types.ObjectId, ref:'Courses', required: true },
  topicId: { type: Schema.Types.ObjectId, ref: 'Topics', required: true },
  starred: { type: Boolean, default: false },
  checkbox: { type: Boolean, default: false },
  notes: { type: String, default: "" },
});

const TopicProgress = mongoose.model('TopicProgress', TopicProgressSchema);
module.exports = TopicProgress;