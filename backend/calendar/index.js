const express = require('express')
const calendarCtrl = require('./calendar.ctrl')

const router = express.Router()

router.get('/', calendarCtrl.getAllEvents)

router.get('/:id', calendarCtrl.getEvent)

router.patch('/:id', calendarCtrl.updateEvent)

module.exports = router 