const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const gPSchema = new Schema({
  participantId: String,
  groupId: String,
  created: {
    type: Date,
    default: Date.now(),
  },
});


module.exports = mongoose.model('GroupParticipant', gPSchema);