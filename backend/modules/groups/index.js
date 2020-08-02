const User = require('../../models/user')
const Group = require('../../models/group')
const GroupParticipant = require('../../models/groupParticipant')
const GroupInvite = require('../../models/groupInvite')
const groupSerializer = require('../../serializers/groupSerializer').groupSerializer;

const groupParticipantDAO = require('../../dao/group-participant-dao');

const { reset_password } = require('../../email');

/**
 * Common way for CRUD the model
 */
const router = require('../../crud')(Group, groupSerializer)


/**
 * Find groups of given client
 */
router.get('/for_client/:workspace', async (req, res) => {
  try {
    const groups = await Group.find({ client_id: req.params.workspace })
    res.status(200).send({ status: 200, result: groups })
  } catch (error) {
    res.status(500).send({ status: 500, error })
  }
})

/**
 * Get unapproved participants of group [DEPRECATED]
 */
router.get('/:groupId/checkParticipant/:participantId', (req, res, next) => {
  const { participantId, groupId } = req.params;
  //Group.find({ groupId, 'participants_ref.user_ref': participantId })
  GroupParticipant.findOne({ participantId, groupId, approved: false }, (e, data) => {
    if (e) {
      res.status(500).send();
    } else {
      res.send(data !== null);
    }

  })
});

/**
 * Became a participant of open group or create request to closed one
 */
router.post('/:group_id/participant/:user_id', async (req,res) => {
  try {
    const { group_id, user_id } = req.params
    const result = await Group.createParticipantOrRequest(group_id, user_id)
    res.status(200).send({
      status: 200,
      result
    })
  } catch (error) {
    console.log('>> becoming a participant error: ', error);
    res.status(500).send(error);
  }
})

/**
 * Delete a participant of any group
 */
router.delete('/:group_id/participant/:user_id', async (req,res) => {
  try {
    const { group_id, user_id } = req.params
    const result = await Group.removeParticipant(group_id, user_id)
    res.status(200).send({
      status: 200,
      result
    })
  } catch (error) {
    console.log('>> removing a participant error: ', error);
    res.status(500).send(error);
  }
})

/**
 * Delete a request to join
 */
router.delete('/:group_id/request/:user_id', async (req,res) => {
  try {
    const { group_id, user_id } = req.params
    const result = await Group.removeRequest(group_id, user_id)
    res.status(200).send({
      status: 200,
      result
    })
  } catch (error) {
    console.log('>> removing a request error: ', error);
    res.status(500).send(error);
  }
})

/**
 * Approve request to join
 */
router.post('/:group_id/participant/:user_id/approve', async (req, res) => {
  const { user_id, group_id } = req.params;

  try {
    const result = await Group.approveRequest(group_id, user_id)
    res.send({ status: 200, result })
  } catch (error) {
    console.log('Error in approve participant: ', error);
    res.status(500).send({ status: 500, result: error })
  }
});

/**
 * Change owner of one group
 */
router.put('/:group_id/owner/:user_id', async (req,res) => {
  const { user_id, group_id } = req.params;
  try {
    const result = await Group.changeOwner(group_id, user_id)
    res.send({ status: 200, result })
  } catch (error) {
    console.log('Error in changing owner of the group: ', error);
    res.status(500).send({ error })
  }
})


router.post('/approveInvite/:inviteId', async (req, res, next) => {
  const invite = await GroupInvite.findOne({ _id: req.params.inviteId }, 'group user')
  try {
    await Group.findById(invite.group._id)
      .then(group => {
        group.participants_ref.push({
          user_ref: invite.user._id
        })
        group.save()
        console.log('>> approveInvite group after save: ', group);
      })
    await GroupInvite.findByIdAndDelete(req.params.inviteId)
    console.log('>>> INVITE APPROVED');
    res.status(200).send()
  } catch (error) {
    console.log('>> approveInvite error: ', error);
    res.status(500).send(error);
  }
});

router.post('/cancelInvite/:inviteId', (req, res, next) => {
  const { inviteId } = req.params;
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
router.post('/replace_owner/:userId', async (req, res) => {
  // ищем админа, пока хардкодом, потом надо брать первого в списке админов конкретного клиента
  const admin = await User.findOne({ email: "w.project.portal3@gmail.com" }, '_id')
  // ищем группы где создатель это переданный userId сотрудника
  await Group.find({ creatorId: req.params.userId }, (err, groups) => {
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
  await GroupParticipant.deleteMany({ participantId: req.params.userId })
  res.status(200).send('Employees was replaced to admin in all groups')
})

/**
 * Get groups that given user can see
 */
router.get('/byUser/:userId', async (req, res) => {
  //const groups = await groupParticipantDAO.findGroupsByUserId(req.params.userId)
  const groups = await Group.findGroupsByUserId(req.params.userId)
  //const grMin = groups.map(g => ({ name: g.name, t: g.type }))
  const data = {
    status: 201,
    result: await groupSerializer(groups)
  }
  if (groups) res.status(200).send(data)
  else res(404).send("Error while getting groups for the user")
})

router.get('/byClient/:client_id', async (req, res) => {
  try {
    const groups = await Group.find({ client_id: req.params.client_id })
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
router.put('/chng_all/client', async (req, res) => {
  if (!req.body.workspace) {
    return res.status(500).send('No workspace given in body')
  }
  try {
    const cnt = await Group.updateMany({ client_id: null }, { client_id: req.body.workspace })
    res.status(201).send(`Изменено ${cnt.nModified} групп`)
  } catch (error) {
    res.status(500).send(error)
  }
})

/**
 * Set one client to one group
 */
router.put('/:group_id/client', async (req, res) => {
  if (!req.body.workspace) {
    return res.status(500).send('No workspace given in body')
  }
  try {
    const new_data = await Group.findByIdAndUpdate(req.params.group_id, { client_id: req.body.workspace }, { new: true })
    res.status(201).send(`Изменена группа: \n ${new_data}`)
  } catch (error) {
    res.status(500).send(error)
  }
})

/**
 * Get requests for user
 */
router.get('/requests/:user_id', async (req, res) => {
  try {
    res.send(await Group.getRequests(req.params.user_id))
  } catch (error) {
    res.status(522).send(error)
  }
})

module.exports = router