const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);

