const mongoose = require('mongoose');
const User = require('./user');
const Post = require('./post');

const utils = require('../utils')

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
  requests_ref: [{
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

const populateMembers = function () {
  this.populate('participants_ref.user_ref', 'firstName lastName positions googleImage')
  this.populate('requests_ref.user_ref', 'firstName lastName positions googleImage')
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
    //console.log(`groups: ${JSON.stringify(groups.map(g => ({ type: g.type, name: g.name })), null, 3)}`);
    return groups
  }
}

/**
 * Включение сотрудника в состав участников или в список подавших заявку на вступление (для закрытой группы)
 * @param {String} group_id 
 * @param {String} user_id 
 */
groupSchema.statics.createParticipantOrRequest = async function(group_id, user_id) {
  const group = await this.findById(group_id)
  // forbid to join into private group thr. POST query
  if (group.type == 2) {
    return res.status(500).send({
      status: 500,
      result: "You cannot join to private group"
    });
  }
  // choose collection based on group type
  const collection = ['participants_ref','requests_ref'][group.type];
  // push user ID to choosen collection and save
  if (!group[collection].find(el => el.user_ref._id.toString() == user_id)) {
    group[collection].push({ user_ref: user_id })
    await group.save()
    return `user has been ${group.type == 0 ? 'added' : 'sent request'} to the group`
  } else 
    return `this user ${group.type == 0 ? 'is participant yet' : 'has sent request earlier'}`
}

/**
 * Удаление сотрудника из состава участников или из списка подавших заявку на вступление
 * @param {String} group_id 
 * @param {String} user_id 
 */
groupSchema.statics.removeParticipant = async function(group_id, user_id) {
  const group = await this.findById(group_id)
  if (group.participants_ref.find(el => el.user_ref._id.toString() == user_id)) {
    group.participants_ref = group.participants_ref.filter(p => p.user_ref._id.toString() != user_id)
    await group.save()
    return `User has been removed from the group`
  } else 
    return `This user is not participant of this group`
}

/**
 * Одобрение заявки на вступление
 * @param {String} group_id 
 * @param {String} user_id 
 */
groupSchema.statics.approveRequest = async function(group_id, user_id) {
  const group = await this.findById(group_id)
  const new_participant = await User.findById(user_id)
  // check that request exists
  if (!group.requests_ref.find(r => r.user_ref._id.toString() == user_id)) {
    return { status: 404, result: 'No requests for this user in this group' }
  }
  // del request and add user as participant
  group.requests_ref = group.requests_ref.filter(p => p.user_ref._id.toString() != user_id)
  group.participants_ref.push({ user_ref: user_id })
  
  //const result = await GroupParticipant.updateOne({ userId, groupId, approved: false }, { approved: true })
  //if (!result.nModified) return res.status(422).send({ status: "No one GroupParticipant was updated" })
  await group.save()

  const fullName = new_participant.firstName + ' ' + new_participant.lastName
  const info_post = {
    message: `${fullName} добавлен в группу ${group.name}`,
    parent: {
      type: "system.GROUPS.NEW_USER",
      group: { id: group_id, name: group.name },
      user: { id: user_id, name: fullName }
    },
    author: "system",
    client_id: group.client_id
  }
  await Post.create(info_post);
  console.log(`info post was created`);
  return {
    status:201,
    result: `Request was approved, user ${fullName} now is the participant of the group` 
  }
}

/**
 * Удаление заявки на вступление из списка заявок группы
 * @param {String} group_id 
 * @param {String} user_id 
 */
groupSchema.statics.removeRequest = async function(group_id, user_id) {
  const group = await this.findById(group_id)
  if (group.requests_ref.find(el => el.user_ref._id.toString() == user_id)) {
    group.requests_ref = group.requests_ref.filter(p => p.user_ref._id.toString() != user_id)
    await group.save()
    return `Request has been removed from the group`
  } else 
    return `No request for this user there is in this group`
}

groupSchema.statics.changeOwner = async function(group_id, user_id) {
  const group = await this.findById(group_id)
  // удаляем старого владельца из участников - пока не удаляем, просто меняем
  //group.participants_ref = group.participants_ref.filter(p => p.user_ref != group.creator)
  // добавляем нового как участника, если его еще нет среди них
  if (!group.participants_ref.find(p => p.user_ref._id.toString() == user_id)) {
    group.participants_ref.push({user_ref: user_id})
  }
  // добавляем нового как владельца группы
  group.creator = user_id
  await group.save()
  return `New user was set as author of the group`
}

groupSchema.statics.getRequests = async function(user_id) {
  const data = await this.find({ creator: user_id, type: 1 }).select('name requests_ref').lean()
  const result = []
  // composite data object
  const getUserData = (req, group) => ({
    ...req.user_ref,
    created: req.created, 
    groupName: group.name,
    userId: req.user_ref._id,
    groupId: group._id,
    fullName: req.user_ref.firstName + ' ' + req.user_ref.lastName
  })
  data.map(group => {
    group.requests_ref.forEach(req => result.push(getUserData(req, group)))
  })
  
  return result.sort(utils.compareByDate)
}

/**
 * Get groups where user can see messages in
 * @param {string} user_id 
 */
groupSchema.statics.getAvailableForPosts = async function(user_id) {
  const { client_id } = await User.findById(user_id).lean()
  const user_ref = mongoose.Types.ObjectId(user_id) 
  const groups_available = await this
      .where({ client_id })
      .where({
        $or: [
          { 'participants_ref.user_ref': user_ref }, //  любые группы где пользователь участник
          { $and: [{ type: 2 }, { creator: user_ref }] } // свои приватные
        ]
      }).select('_id name')
  //return groups_available.map(gr => gr._id) // only ids - not readible for human to control correctness
  return groups_available.map(gr => ({_id: gr._id, name: gr.name}))
  
}

module.exports = mongoose.model('Group', groupSchema);