const User = require('@models/user')
const UsersInDepartment = require('@models/usersInDepartment')

const serializers = require('@/serializers');

var userDAO = require('./user-dao');

/**
 * Common way for CRUD the model
 */
const router = require('@/crud')(User, serializers.serializer)

// TODO: find a purpose of this api out
router.get('/info/me', (req, res) => {
  console.log(`authRouter by /user/info/me ${JSON.stringify(req.decoded,null,3)}`)
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
 * Delete/Undelete user actions - PUT because DELETE request is reserved by 
 */
router.put('/delete/:userId', async (req, res) => {
  const user_id = req.params.userId
  try {
    const user = await User.findByIdAndUpdate(user_id, {$set: {deletion_mark: true}}, {new: true})
    // delete from departments
    const depts = await UsersInDepartment.find({users: user_id})
    await Promise.all(
      depts.map( async doc => {
        doc.users = doc.users.filter(user => user!=user_id)
        await doc.save()
        return doc._id
      }))
    res.status(200).send(user)
  } catch (error) {
    console.error("> delete user, error: ", error);
    return res.status(500).send("There was a problem deleting the user: "+error);
  }
})

router.put('/undelete/:userId', (req, res) => {
  User.findByIdAndUpdate(req.params.userId, {$set: {deletion_mark: false}}, {new: true}, (error,doc) => {
    if (error) return res.status(500).send("There was a problem undeleting the user");
    res.status(200).send(doc)
  })
})

/**
 * Roles
 */
router.put('/:user_id/role/:role', (req, res) => {
  User.findById(req.params.user_id, (err,user) => {
    if (err) return res.status(500).send(err)
    if (!user.roles) {
      user.roles = [req.params.role]
      user.save()
      res.send(user)
    } else if (!user.roles.includes(req.params.role)){
        user.roles.push(req.params.role)
        user.save()
        res.send(user)
      }
      else res.send(user)
  })
})

router.delete('/:user_id/role/:role', (req, res) => {
  User.findById(req.params.user_id, (err,user) => {
    if (err) return res.status(500).send(err)
    if (!user.roles) return res.status(522).send("User has no roles")
    if (!user.roles.includes(req.params.role)) return res.status(522).send(`User has not role '${req.params.role}'`)
    user.roles.splice(user.roles.indexOf(req.params.role),1)
    user.save()
    res.send(user)
  })
})

module.exports = router