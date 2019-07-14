const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: String,
    description: String,
    type: Number,
    created: {
        type: Date,
        default: Date.now(),
    },
    creatorId: String,
});

module.exports = mongoose.model('Group', groupSchema);