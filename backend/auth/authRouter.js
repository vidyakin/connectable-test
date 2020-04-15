const router = require('express').Router();

const User = require('../models').User;

router.post('/login', require('./login')); // router = /api/login  (общая точка логина для всех способов)
router.get('/user/me', (req, res) => {     // router = /api/user/me
  // let cache = []
  // let strReq = JSON.stringify(req, (key, value) => {
  //     if (typeof value === 'object' && value !== null) {
  //         if (cache.indexOf(value) !== -1) {
  //             // Duplicate reference found, discard key
  //             return;
  //         }
  //         // Store value in our collection
  //         cache.push(value);
  //     }
  //     return value;
  // }, 3)
  //cache = null;
  console.log(`authRouter by /user/me req.decoded=${req.decoded}`)
  if (req.decoded == undefined) {
    res.send(undefined);
  } else {
    User.findOne({googleId: req.decoded.user}, (err, user) => {
      res.send(user);
    })
  }  
});

module.exports = router;