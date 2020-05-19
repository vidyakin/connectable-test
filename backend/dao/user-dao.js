const User = require('../models/user');

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

module.exports.delUserById = (req, res) => {
  User.findByIdAndUpdate(req.params.userId, {$set: {deletion_mark: true}}, {new: true}, (error,doc) => {
    if (error) return res.status(500).send("There was a problem deleting the user");
    res.status(200).send(doc)
  })
}

module.exports.undelUserById = (req, res) => {
  User.findByIdAndUpdate(req.params.userId, {$set: {deletion_mark: false}}, {new: true}, (error,doc) => {
    if (error) return res.status(500).send("There was a problem undeleting the user");
    res.status(200).send(doc)
  })
}