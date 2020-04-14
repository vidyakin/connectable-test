const express = require('express')
const calendarCtrl = require('./google.calendar.ctrl')

const router = express.Router()

router.get('/', calendarCtrl.getAllEvents)
router.post('/', calendarCtrl.addEvent)

router.get('/:id', calendarCtrl.getEvent)

router.patch('/:id', calendarCtrl.updateEvent)

module.exports = router 