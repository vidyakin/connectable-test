const GroupParticipant = require('../models/groupParticipant');

module.exports.findByGroupId = async (groupId) => {
  return new Promise((resolve, rejected) => {
    GroupParticipant.find({groupId}, (err, data) => {
      if (err) {
        rejected(err)
      } else {
        resolve(data)
      }
    })
  })
};

module.exports.findByUserId = async (userId) => {
  return new Promise((resolve, rejected) => {
    GroupParticipant.find({participantId: userId}, (err, data) => {
      if (err) {
        rejected(err)
      } else {
        resolve(data)
      }
    })
  })
};