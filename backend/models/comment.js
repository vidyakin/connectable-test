const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    parent: Object,
    author: Object,
    message: String,
    created: {
        type: Date,
        default: Date.now(),
    },
    likes: Array,
    answers: Array,
});

module.exports = mongoose.model('Comment', commentSchema);