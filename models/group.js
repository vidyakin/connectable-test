const mongoose = require('mongoose');
const groupParticipant = require('./groupParticipant');

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
    participants: Array,
});

groupSchema.pre('save', function (next) {
    groupParticipant.create({groupId: this._id, participantId: this.creatorId});
    next();
});

module.exports = mongoose.model('Group', groupSchema);