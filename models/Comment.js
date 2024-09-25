const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  postId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
