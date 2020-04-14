const calendarService = require('./google.calendar.service')

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
  console.log('++++++++ Google calendar ctrl: getAllEvents: ++++++++')
  //console.log('HEADERS',req.headers)
  const { data, error } = await calendarService.listEvents(req.headers.authorization)
  console.log('>> data:',data)
  console.log('>> error:',error)
  console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++')
  return error ? res.sendStatus(500).json(error) : res.json(data)
}

exports.addEvent = async (req,res,next) => {
  console.log(`ADD Google EVENT STUB`);
  
}

exports.getEvent = async (req,res,next) => {
  console.log(`GET Google EVENT STUB`);
  
}
exports.updateEvent = async (req,res,next) => {
  console.log(`UPD Google EVENT STUB`);
  
}