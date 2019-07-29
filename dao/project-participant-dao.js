const ProjectParticipant = require('../models/projectParticipant');

module.exports.findByProjectId = async (projectId) => {
  return new Promise((resolve, rejected) => {
    ProjectParticipant.find({projectId}, (err, data) => {
      if (err) {
        rejected(err)
      } else {
        resolve(data)
      }
    })
  })
};

module.exports.findRequestsByGroupId = async (projectId) => {
  return new Promise((resolve, rejected) => {
    ProjectParticipant.find({projectId}, (err, data) => {
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
    ProjectParticipant.find({participantId: userId}, (err, data) => {
      if (err) {
        rejected(err)
      } else {
        resolve(data)
      }
    })
  })
};