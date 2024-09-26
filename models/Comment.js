const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: String,
  content: String,
  email: String, 
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
