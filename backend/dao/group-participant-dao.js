const mongoose = require('mongoose');
const GroupParticipant = require('../models/groupParticipant');
const Group = require('../models/group');
const User = require('../models/user');

module.exports.findByGroupId = async (groupId) => {
  return new Promise((resolve, rejected) => {
    GroupParticipant.find({groupId, approved: true}, (err, data) => {
      if (err) {
        rejected(err)
      } else {
        resolve(data)
      }
    })
  })
};

module.exports.findRequestsByGroupId = async (groupId) => {
  return new Promise((resolve, rejected) => {
    GroupParticipant.find({groupId, approved: false}, (err, data) => {
      if (err) {
        rejected(err)
      } else {
        resolve(data)
      }
    })
  })
};

module.exports.findGroupsByUserId = async (userId) => {
  // return new Promise((resolve, rejected) => {
  //   GroupParticipant.find({participantId: userId}, (err, data) => {
  //     if (err) {
  //       rejected(err)
  //     } else {
  //       resolve(data)
  //     }
  //   })
  // })
  try {
    const user = await User.findOne({_id: userId})
    const client_id = user.client_id
    // TODO: добавить отбор по клиенту
    // TODO: добавить проверку роли когда они будут в пользователях
    if (user.email == "w.project.portal3@gmail.com") {
      return await Group.find()      
    } else {
      let groupIds = await GroupParticipant.find()
        .where('participantId').equals(userId)
        .select('groupId')
      console.log(`groupIds: ${JSON.stringify(groupIds,null,3)}`);
      
      if (!groupIds.length) return [] // Nothing found
      
      groupIds = groupIds.map(_ => mongoose.Types.ObjectId(_.groupId))
      const groups = await Group.find({client_id})
        .or([
          { type: { $in: [0,1] }}, // открытые и закрытые видно, но в закрытых не должно быть видно посты и участников (?)
          { _id: { $in: groupIds} } // приватные не видно
        ])
      return groups
    }
  } catch (error) {
    return error
  }
  
};