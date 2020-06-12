const mongoose = require('mongoose');
const likeDao = require('../dao/like-dao');

// schema maps to a collection
const Schema = mongoose.Schema;

const postSchema = new Schema({
  client_id: String,       // код клиента
  parent: Object,
  message: String,
  author: Object,
  attachment: Array,
  created: {
    type: Date,
    default: Date.now(),
  },
  likes: Array,
  comments: Array,
  edited: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('Post', postSchema);