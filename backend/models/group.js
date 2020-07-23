const mongoose = require('mongoose');
const groupParticipant = require('./groupParticipant');
const User = require('./user');
const client = require('./client');

// schema maps to a collection
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  client_id: {
    type: String,       // код клиента
    required: true
  },
  name: String,
  description: String,
  type: Number,
  created: {
    type: Date, default: Date.now
  },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  creatorId: String,  // OLD FIELD
  participants: Array,  // OLD FIELD
  participants_ref: [{
    user_ref: {
      type: Schema.Types.ObjectId, ref: 'User'
    },
    join_date: {
      type: Date, default: Date.now,
    }
  }],
  requests: [{
    user_ref: {
      type: Schema.Types.ObjectId, ref: 'User'
    },
    created: {
      type: Date, default: Date.now,
    }
  }],
  invites: [{
    type: Schema.Types.ObjectId, ref: 'GroupInvite'
  }]
});

const populateMembers = function (next) {
  this.populate('participants_ref.user_ref', 'firstName lastName positions googleImage');
  next()
}

groupSchema
  .pre('find', populateMembers)
  .pre('findById', populateMembers)
  .pre('findOne', populateMembers);

groupSchema.pre('save', function (next) {
  if (this.participants_ref.findIndex(p => p.user_ref._id == this.creatorId) === -1) {
    this.participants_ref.push({ user_ref: this.creator._id });
  }
  next();
  // groupParticipant.create({ groupId: this._id, participantId: this.creatorId }).then(() => {
  //   next();
  // });
});

groupSchema.post('save', function (doc, next) {
  doc.populate('participants_ref.user_ref', 'firstName lastName positions')
    .execPopulate()
    .then(() => {
      next();
    });
});

// *********
// Static methods

/**
 * Поиск групп, которые пользователь может видеть в списке групп
 * @param {String} user_id User's ID as string
 */
groupSchema.statics.findGroupsByUserId = async function (user_id) {
  const { email, client_id } = await User.findById(user_id, 'email client_id')
  // TODO: добавить проверку роли когда они будут в пользователях
  if (email == "w.project.portal3@gmail.com") {
    return await this.where({ client_id })
  } else {
    const user_ref = mongoose.Types.ObjectId(user_id)
    let groups = await this
      .where({ client_id })
      .where({
        $or: [
          { type: { $in: [0, 1] } }, // все открытые и закрытые видно
          { $and: [{ type: 2 }, { 'participants_ref.user_ref': user_ref }] }, // приватные где пользователь участник
          { $and: [{ type: 2 }, { creator: user_ref }] } // свои приватные
        ]
      })
    console.log(`groups: ${JSON.stringify(groups.map(g => ({ type: g.type, name: g.name })), null, 3)}`);
    return groups
  }
}

module.exports = mongoose.model('Group', groupSchema);