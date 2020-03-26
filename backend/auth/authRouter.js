const router = require('express').Router();

const User = require('../models').User;

router.post('/login', require('./login')); // router = /api/login  (общая точка логина для всех способов)
router.get('/user/me', (req, res) => {     // router = /api/user/me
  console.log(`authRouter by /user/me`)
  if (req.decoded == undefined) {
    res.send(undefined);
  } else {
    User.findOne({googleId: req.decoded.user}, (err, user) => {
      res.send(user);
    })
  }  
});

module.exports = router;