const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const gPSchema = new Schema({
  participantId: String,
  projectId: String,
  created: {
    type: Date,
    default: Date.now(),
  },
});


module.exports = mongoose.model('ProjectParticipant', gPSchema);