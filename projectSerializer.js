const projectParticipantDao = require('./dao/project-participant-dao');
const UserDao = require('./dao/user-dao');

module.exports.projectSerializer = async (data) => {
  if (Array.isArray(data)) {
    return await arrayProjectSerializer(data);
  } else {
    let userIds = await projectParticipantDao.findByProjectId(data._id);
    userIds = userIds.map(groupParticipant => groupParticipant.participantId);
    let requestsIds = await projectParticipantDao.findRequestsByGroupId(data._id);
    requestsIds = requestsIds.map(groupParticipant => groupParticipant.participantId);
    data.requests = await UserDao.findUsersByIds(requestsIds);
    data.participants = await UserDao.findUsersByIds(userIds);
    return data;
  }
};


async function arrayProjectSerializer(data) {
  return new Promise((resolve, rejected) => {
    const result = [];
    Promise.all(data.map(async(project) => {
      let userIds = await projectParticipantDao.findByProjectId(project._id);
      userIds = userIds.map(groupParticipant => groupParticipant.participantId);
      project.participants = await UserDao.findUsersByIds(userIds);
      result.push(project);
    })).then(() => {
      resolve(result);
    })
      .catch(e => {
        rejected(e);
      });
  })
}
