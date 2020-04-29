const GroupDao = require('../dao/group-dao');

module.exports.inviteSerializer = async (data) => {
  if (Array.isArray(data)) {
    return await arrayGroupSerializer(data);
  } else {
    data.group = await GroupDao.findById(data.groupId);
    return data;
  }
};


async function arrayGroupSerializer(data) {
  return new Promise((resolve, rejected) => {
    const result = [];
    Promise.all(data.map(async(invite) => {
      invite.group = await GroupDao.findById(data.group.id);
      result.push(invite);
    })).then(() => {
      resolve(result);
    })
      .catch(e => {
        rejected(e);
      });
  })
}
