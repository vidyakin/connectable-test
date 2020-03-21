const mongoose = require('mongoose');
const projectParticipant = require('./projectParticipant');

// schema maps to a collection
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    description: String,
    created: {
        type: Date,
        default: Date.now(),
    },
    creatorId: String,
    participants: Array,
});

projectSchema.pre('save', function (next) {
    projectParticipant.create({projectId: this._id, participantId: this.creatorId});
    next();
});

module.exports = mongoose.model('Project', projectSchema);