const Group = require('../models/group');

module.exports.findById = async (id) => {
  return new Promise((resolve, rejected) => {
    Group.findById(id, (err, data) => {
      if (err) {
        rejected(err)
      } else {
        resolve(data)
      }
    })
  })
};

