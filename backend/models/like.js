const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  parent: Object,
  author: Object,
  created: {
      type: Date,
      default: Date.now(),
  },
});

module.exports = mongoose.model('Like', likeSchema);