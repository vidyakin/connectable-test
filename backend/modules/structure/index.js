const Structure = require('../../models/structure')

const serializers = require('../../serializers');

/**
 * Common way for CRUD the model
 */
const router = require('../../crud')(Structure, serializers.serializer)

router.get('/byClient/:client', async (req,res) => {
  try {
    const struct = await Structure.findOne({client_id: req.params.client})
    res.status(200).send({status: 200, result: !struct ? {} : struct})
  } catch (error) {
    res.status(500).send(error)
  }  
})

module.exports = router