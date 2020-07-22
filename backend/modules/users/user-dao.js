const User = require('../../models/user');

module.exports.findById = async (id) => {
  return new Promise((resolve, rejected) => {
    User.findById(id, (err, data) => {
      if (err) {
        rejected(err)
      } else {
        resolve(data)
      }
    })
  })
};

module.exports.findUsersByIds = async (userIds) => {
  return new Promise((resolve, rejected) => {
    const result = [];
    Promise.all(userIds.map(async(id) => {
        result.push(await this.findById(id));
    })).then(() => {
      resolve(result);
    })
      .catch(e => {
        rejected(e);
      });
  })
}
