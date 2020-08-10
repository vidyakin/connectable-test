const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    parent: Object,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    message: String,
    created: {
        type: Date,
        default: Date.now(),
    },
    likes: Array,
    answers: Array,
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});


commentSchema.pre('find', function () {
    this.populate('mentions', 'firstName lastName').populate('author', 'firstName lastName');
});

commentSchema.post('save', function (doc, next) {
    doc.populate('mentions', 'firstName lastName')
        .populate('author', 'firstName lastName').execPopulate().then( () => {
        next();
    })
});

module.exports = mongoose.model('Comment', commentSchema);