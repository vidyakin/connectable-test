const mongoose = require('mongoose');
const likeDao = require('../dao/like-dao');

// schema maps to a collection
const Schema = mongoose.Schema;

const postSchema = new Schema({
  parent: Object,
  message: String,
  author: Object,
  attachment: [{type: String, url: String}],
  created: {
    type: Date,
    default: Date.now(),
  },
  likes: Array,
  comments: Array,
});

module.exports = mongoose.model('Post', postSchema);