
const router = require('express').Router()

const User = require('../../models/user')

const serializers = require('../../serializers');

var userDAO = require('./user-dao');

/**
 * Common way for CRUD the model
 */
router.get('/', require('../../crud')(User, serializers.serializer))

// TODO: find a purpose of this api out
router.get('/me', (res, req) => {
  console.log(`authRouter by /user/me req.decoded=${req.decoded}`)
  if (req.decoded == undefined) {
    res.send(undefined);
  } else {
    User.findOne({googleId: req.decoded.user}, (err, user) => {
      res.send(user);
    })
  }
})

/**
 * Find users of given client
 */
router.get('/for_client/:workspace', (req, res) => {
  User.find({client_id: req.params.workspace}).then( users => {
    const result = { stasus: 201, result: users }
    res.send(result)
  }) 
})

/**
 * Delete/Undelete user actions
 */
router.put('/delete/:userId', userDAO.delUserById)
router.put('/undelete/:userId', userDAO.undelUserById)

module.exports = router