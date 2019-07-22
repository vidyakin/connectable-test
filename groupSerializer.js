const groupParticipantDao = require('./dao/group-participant-dao');
const UserDao = require('./dao/user-dao');

module.exports.groupSerializer = async (data) => {
  if (Array.isArray(data)) {
    return await arrayGroupSerializer(data);
  } else {
    let userIds = await groupParticipantDao.findByGroupId(data._id);
    userIds = userIds.map(groupParticipant => groupParticipant.participantId);
    data.participants = await UserDao.findUsersByIds(userIds);
    return data;
  }
};


async function arrayGroupSerializer(data) {
  return new Promise((resolve, rejected) => {
    const result = [];
    Promise.all(data.map(async(group) => {
      let userIds = await groupParticipantDao.findByGroupId(group._id);
      userIds = userIds.map(groupParticipant => groupParticipant.participantId);
      group.participants = await UserDao.findUsersByIds(userIds);
      result.push(group);
    })).then(() => {
      resolve(result);
    })
      .catch(e => {
        rejected(e);
      });
  })
}
