const Like = require('../models/like');

module.exports.findByParent = async (options) => {
  return new Promise((resolve, rejected) => {
    Like.find(options, (err, data) => {
      if (err) {
        rejected(err)
      } else {
        resolve(data)
      }
    })
  })
};