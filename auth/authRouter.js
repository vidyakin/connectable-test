const router = require('express').Router();

const User = require('../models').User;

router.post('/login', require('./login'));
router.get('/user/me', (req, res) => {
  User.findOne({googleId: req.decoded.user}, (err, user) => {
    res.send(user);
  })
});

module.exports = router;