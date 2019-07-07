const Comment = require('../models/comment');

module.exports.findByParent = async (options) => {
  return new Promise((resolve, rejected) => {
    Comment.find(options, (err, data) => {
      if (err) {
        rejected(err)
      } else {
        resolve(data)
      }
    })
  })
};