const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const gISchema = new Schema({
  client_id: {
    type: String,       // код клиента
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  //userId: String,
  //groupId: String,
  group: { type: Schema.Types.ObjectId, ref: 'Group' },
});

gISchema.pre('findOne', function (next) {
  this.populate('user', 'firstName lastName')
    .populate('group', 'name description type')
  next()
})

module.exports = mongoose.model('GroupInvite', gISchema);