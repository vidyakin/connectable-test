const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
  const {username, password, googleId, outlookId} = req.body;
  if (username && password) {
    let result = {};
    let status = 200;
    User.findOne({username}, (err, user) => {
      if (!err && user && user.deletion_mark) {
        result.status = 403;
        result.error = `Enter not allowed - you are not a user of system yet`;
      } else if (!err && user) {
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
          //res.status(status).send(result);
        }).catch(err => {
          status = 500;
          result.status = status;
          result.error = err;
          //res.status(status).send(result);
        });
      } else {
        status = 404;
        result.status = status;
        result.error = err;
        //res.status(status).send(result);
      }
      res.status(status).send(result);
    });
  }
  else if (outlookId) {
    let result = {};
    let status = 200;

    User.findOne({outlookId: outlookId}, (err, user) => {
      if (!err && user) {
        status = 200;
        user.password = '';
        const payload = {result: user};
        const secret = process.env.JWT_SECRET;
        result.token = jwt.sign(payload, secret, {
          expiresIn: 86400 // expires in 24 hours
        });

        result.status = status;
        result.result = user;
        User.findOneAndUpdate({_id: user._id}, {outlookId: req.body.outlookId}, (err, data) => {
        });
        res.status(status).send(result);
      } else {
        req.body.password = 'nopass';
        User.create(req.body, (err, newUser) => {
          status = 201;
          const payload = {user: newUser.outlookId};
          const secret = process.env.JWT_SECRET;
          result.token = jwt.sign(payload, secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          result.status = status;
          result.result = newUser;
          res.status(status).send(result);
        })
      }
    });
  }
  else if (googleId) { 
    let result = {};
    let status = 200;
    User.findOne({googleId: googleId}, (err, user) => {
      if (!err && user) {
        status = 200;
        user.password = '';
        const payload = {result: user};
        const secret = process.env.JWT_SECRET;
        result.token = jwt.sign(payload, secret, {
          expiresIn: 86400 // expires in 24 hours
        });

        result.status = status;
        result.result = user;
        User.findOneAndUpdate({_id: user._id}, req.body, (err, data) => {
        });
        console.log(`  >>> Google login, result is: ${JSON.stringify(result, null, '\t')}`)
        console.log(`  >>> Google login, req.body is: ${JSON.stringify(req.body, null, '\t')}`)        
        res.status(status).send(result);
      } else {
        req.body.password = 'nopass';
        User.create(req.body, (err, newUser) => {
          status = 201;
          const payload = {user: newUser.googleId};
          const secret = process.env.JWT_SECRET;
          result.token = jwt.sign(payload, secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          result.status = status;
          result.result = newUser;
          console.log(`  >>> Google user created, newUser is: ${JSON.stringify(newUser, null, '\t')}`)
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