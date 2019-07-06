const mongoose = require('mongoose');

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
    }
});

module.exports = mongoose.model('Post', postSchema);