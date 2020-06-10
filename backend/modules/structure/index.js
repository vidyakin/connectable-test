const Structure = require('../../models/structure');
const UsersInDepartment = require('../../models/usersInDepartment');

const serializers = require('../../serializers');

/**
 * Common way for CRUD the model
 */
const router = require('../../crud')(Structure, serializers.serializer)

router.get('/byClient/:workspace', async (req,res) => {
  try {
    const struct = await Structure.findOne({client_id: req.params.workspace})
    res.status(200).send({status: 200, result: !struct ? {} : struct})
  } catch (error) {
    res.status(500).send(error)
  }  
})

router.get('/byClient/:workspace/dept_users', async (req,res) => {
  try {
    const users_in_depts = await UsersInDepartment.find({client_id: req.params.workspace})
    res.status(200).send({
      status: 200,
      result: users_in_depts
    })
  } catch (error) {
    res.status(500).send("Error during getting employees in departments");
  }
})

module.exports = router