const mongoose = require('mongoose');
const Client = require('../../models/client')
const User = require('../../models/user')
//const serializers = require('../../serializers');

/**
 * Individual serializer for client, that append new field "users" - number users of the client
 * @param {Client} data 
 */
const serializer = async data => {
  // function for one element
  const slzer = async element => {
    const elObj = element.toObject()
    elObj.users = await User.countDocuments({client_id: element.workspace})
    return elObj
  }
  // get result for list or one 
  if (Array.isArray(data)) {
    const result = await Promise.all(data.map(d => slzer(d)))
    //console.log(`GET CLIENTS RESULT : ${result}`);
    return result
  } else 
    return await slzer(data)
}

/**
 * Common way for CRUD the model
 */
const router = require('../../crud')(Client, serializer);

// Поиск клиента по workspace
router.get('/api/client_by_ws/:wspace', async (req, res) => {
  try {
      const client = await Client.findOne({workspace: req.params.wspace})
      //console.log('client:',client);
      res.status(200).send(client)
  } catch (error) {
      res.status(404).send("No client with sent workspace: "+req.params.wspace)
  }
  
})

module.exports = router