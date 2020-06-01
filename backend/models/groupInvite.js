const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const gISchema = new Schema({
  clientId: String,       // код клиента
  userId: String,
  groupId: String,
  created: {
    type: Date,
    default: Date.now(),
  },
  group: Object,
});


module.exports = mongoose.model('GroupInvite', gISchema);