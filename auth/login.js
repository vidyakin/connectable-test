const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
  const {username, password, googleToken} = req.body;
  if (username && password) {
    let result = {};
    let status = 200;
    User.findOne({username}, (err, user) => {
      if (!err && user) {
        bcrypt.compare(password, user.password).then(match => {
          if (match) {
            status = 200;
            const payload = {user: user.name};
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret);

            result.token = token;
            result.status = status;
            result.result = user;
          } else {
            status = 401;
            result.status = status;
            result.error = `Authentication error`;
          }
          res.status(status).send(result);
        }).catch(err => {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        });
      } else {
        status = 404;
        result.status = status;
        result.error = err;
        res.status(status).send(result);
      }
    });
  }
  else if (googleToken) {
    let result = {};
    let status = 200;
    User.findOne({googleToken}, (err, user) => {
      if (!err && user) {
        status = 200;
        const payload = {user: user.name};
        const secret = process.env.JWT_SECRET;
        result.token = jwt.sign(payload, secret);
        result.status = status;
        result.result = user;
        res.status(status).send(result);
      } else {
        req.body.password = 'nopass';
        User.create(req.body, (err, newUser) => {
          console.log(err);
          status = 200;
          const payload = {user: newUser.name};
          const secret = process.env.JWT_SECRET;
          result.token = jwt.sign(payload, secret);
          result.status = status;
          result.result = newUser;
          res.status(status).send(result);
        })
      }
    });
  }
  else {
    let result = {};
    let status = 200;
    status = 404;
    result.status = status;
    result.error = 'Something bad';
    res.status(status).send(result);
  }

};