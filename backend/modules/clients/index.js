const Client = require('@models/client')
const User = require('@models/user')
const Post = require('@models/post')
const Group = require('@models/group')
const Message = require('@models/message')
const Event = require('@models/event')
//const serializers = require('../../serializers');

/**
 * Individual serializer for client, that append new field "users" - number users of the client
 * @param {Client} data 
 */
const serializer = async data => {
  // function for one element
  const slzer = async element => {
    const elObj = element.toObject()
    elObj.users = await User.countDocuments({ client_id: element.workspace })
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
const router = require('@/crud')(Client, serializer);

// Поиск клиента по workspace
router.get('/by_ws/:wspace', async (req, res) => {
  try {
    const client = await Client.findOne({ workspace: req.params.wspace })
    //console.log('client:',client);
    res.status(200).send(client)
  } catch (error) {
    res.status(404).send("No client with sent workspace: " + req.params.wspace)
  }

})

/**
 * Статистика по базовым коллекциям. 
 * Зависимые коллекции (комментарии, лайки, ответы - удаляются совместно с владельцами)
 */
router.get('/stat/:client_id', async (req, res) => {
  try {
    const filter = { client_id: req.params.client_id }
    const empty_client = { client_id: undefined }
    // get stat on all models
    const stat = await Promise.all([User, Post, Event, Group, Message].map(async model => {
      const docs_count = await model.countDocuments(filter)
      return {
        collection: model.collection.collectionName,
        docs_count
      }
    }))

    res.json(stat)
  } catch (error) {
    console.log('Error while getting stats: ', error);
    res.status(522).send(error)
  }
})

router.delete('/:client_id/:coll_name', async (req, res) => {

})

module.exports = router