const calendarService = require('./calendar.service')

/**
 *
 * @api {get} / get all events
 * @apiVersion 0.1.0
 * @apiName GetAllEvents
 * @apiDescription Returns all the calendar events
 * @apiGroup Calendar
 *
 */
exports.getAllEvents = async (req, res, next) => {
  console.log('calendar:getAllEvents')
  const { data, error } = await calendarService.getAllEvents(req.headers.authorization, req.query)
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  console.log(data)
  console.log(error)
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  return error ? res.sendStatus(500).json(error) : res.json(data)
}

/**
 *
 * @api {get} /:id get event
 * @apiVersion 0.1.0
 * @apiName GetEvent
 * @apiDescription Get event by id
 * @apiGroup Calendar
 *
 */
exports.getEvent = async (req, res, next) => {
  console.log('calendar:getEvent')
  const { data, error } = await calendarService.getEvent(req.headers.authorization, req.params.id)
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  console.log(data)
  console.log(error)
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  return error ? res.sendStatus(500).json(error) : res.json(data)
}

/**
 *
 * @api {patch} /:id update event
 * @apiVersion 0.1.0
 * @apiName UpdateEvent
 * @apiDescription Updates the calendar event with id
 * @apiGroup Calendar
 *
 */
exports.updateEvent = async (req, res, next) => {
  const { data, error } = await calendarService.updateEvent(req.headers.authorization, req.params.id, req.body.event)
  return error ? res.sendStatus(500).json(error) : res.json(data)
}