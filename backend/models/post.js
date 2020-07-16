const mongoose = require('mongoose');
const likeDao = require('../dao/like-dao');

// schema maps to a collection
const Schema = mongoose.Schema;

const postSchema = new Schema({
  client_id: String,       // код клиента
  parent: Object,
  message: String,
  author_ref: { type: Schema.Types.ObjectId, ref: 'User' },
  author: Object,
  attachment: Array,
  created: { type: Date, default: Date.now },
  likes: [{
    created: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  edited: { type: Boolean, default: false },
  mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const populatePost = function () {
  this.populate('mentions', 'firstName lastName')
    .populate('likes.author', 'firstName lastName')
}

postSchema.pre('findOne', populatePost)
  .pre('find', populatePost);

postSchema.post('save', function (doc, next) {
  doc.populate('mentions', 'firstName lastName')
    .execPopulate()
    .then(() => {
      next();
    })
});

module.exports = mongoose.model('Post', postSchema);