const Group = require('../../models/group')
const GroupParticipant = require('../../models/groupParticipant')
const groupSerializer = require('../../serializers/groupSerializer').groupSerializer;

const groupParticipantDAO = require('../../dao/group-participant-dao')

/**
 * Common way for CRUD the model
 */
const router = require('../../crud')(Group, groupSerializer)

/**
 * Find groups of given client
 */
router.get('/for_client/:workspace', async (req, res) => {
  try {
    const groups = await Group.find({client_id: req.params.workspace})
    res.status(200).send({ status: 200, result: groups })
  } catch (error) {
    res.status(500).send({ status: 500, error })
  }
})

/**
 * Get unapproved participants of group
 */
router.get('/:groupId/checkParticipant/:participantId', (req, res, next) => {
  const {participantId, groupId} = req.params;
  GroupParticipant.findOne({participantId, groupId, approved: false}, (e, data) => {
    if (e) {
      res.status(500).send();
    } else {
      res.send(data !== null);
    }

  })
});

router.post('/:groupId/approveParticipant/:participantId', (req, res, next) => {
  const {participantId, groupId} = req.params;
  GroupParticipant.updateMany({participantId, groupId}, {approved: true}, (e, data) => {
    if (e) {
      res.status(500).send();
    } else {
      res.status(200).send();
    }

  })
});

router.post('/approveInvite/:inviteId', (req, res, next) => {
  const {inviteId} = req.params;
  GroupInvite.findByIdAndDelete(inviteId, (e, data) => {
    if (e) {
      res.status(500).send();
    } else {
      GroupParticipant.create({participantId: data.userId, groupId: data.groupId}, (err, data) => {
        res.status(200).send();
      })
    }

  })
});

router.post('/cancelInvite/:inviteId', (req, res, next) => {
  const {inviteId} = req.params;
  GroupInvite.findByIdAndDelete(inviteId, (e, data) => {
    if (e) {
      res.status(500).send();
    } else {
      res.status(200).send();
    }

  })
});

/**
 * Replacing owner of group, for example when original owner was fired
 */
router.post('/replace_owner/:userId', async (req,res) => {
  // ищем админа, пока хардкодом, потом надо брать первого в списке админов конкретного клиента
  const admin = await User.findOne({ email: "w.project.portal3@gmail.com" }, '_id')
  // ищем группы где создатель это переданный userId сотрудника
  await Group.find({creatorId: req.params.userId}, (err, groups) => {
      groups.forEach(group => {
          // заменяем создателя группы
          group.creatorId = admin._id
          // заменяем участника
          const prt_i = group.participants.findIndex(p => p._id == req.params.userId)
          if (prt_i != -1) {
              group.participants.splice(prt_i, 1, admin)
          }
          group.save()
          console.log(`creator of group ${group.name} was changed`);
      })
  })
  // удаляем участника в отдельной коллекции участников, мидлварь создаст новую запись сама
  await GroupParticipant.deleteMany({participantId: req.params.userId})
  res.status(200).send('Employees was replaced to admin in all groups')
})

/**
 * Get groups that given user can see
 */
router.get('/byUser/:userId', async (req,res) => {
  const groups = await groupParticipantDAO.findGroupsByUserId(req.params.userId)
  const grMin = groups.map(g => ({name: g.name, t: g.type}))
  const data = {
      status: 201,
      result: await groupSerializer(groups)
  }
  if (groups) res.status(200).send(data)
  else res(404).send("Error while getting groups for the user")
})

router.get('/byClient/:client_id', async (req,res) => {
  try {
    const groups = await Group.find({client_id: req.params.client_id})
    const data = {
      status: 201,
      result: await groupSerializer(groups)
    }
    return res.send(data)
  } catch (error) {
    res.status(500).send(error)
  }
})

/**
 * Set one client to all groups with empty "client_id" field
 */
router.put('/chng_all/client', async (req,res) => {
  if (!req.body.workspace) {
    return res.status(500).send('No workspace given in body')
  }
  try {
    const cnt = await Group.updateMany({client_id: null}, {client_id: req.body.workspace})
    res.status(201).send(`Изменено ${cnt.nModified} групп`)
  } catch (error) {
    res.status(500).send(error)
  }
  
})

/**
 * Set one client to one group
 */
router.put('/:group_id/client', async (req,res) => {
  if (!req.body.workspace) {
    return res.status(500).send('No workspace given in body')
  }
  try {
    const new_data = await Group.findByIdAndUpdate(req.params.group_id, {client_id: req.body.workspace}, {new: true})
    res.status(201).send(`Изменена группа: \n ${new_data}`)
  } catch (error) {
    res.status(500).send(error)
  }
  
})


module.exports = router