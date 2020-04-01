const util = require('util')
const outlook = require('node-outlook')
const { OUTLOOK_ENDPOINT } = require('./constants')
const jwt = require('jsonwebtoken')

outlook.base.setApiEndpoint(OUTLOOK_ENDPOINT)

outlook.calendar.getEventAsync = util.promisify(outlook.calendar.getEvent)
outlook.calendar.getEventsAsync = util.promisify(outlook.calendar.getEvents)
outlook.calendar.updateEventAsync = util.promisify(outlook.calendar.updateEvent)

// get all events list
exports.getAllEvents = async (token, { top = 20 }) => {
  console.log('--- Начало получения всех событий -----')
  let aud = jwt.decode(token);
  console.log('Decoded token', aud)
  try {
    // Get the events from outlook api
    const result = await outlook.calendar.getEventsAsync({
      token,
      useMe: true,
      odataParams: {
        '$select': 'Subject,Start,End,Attendees,Location',
        '$orderBy': 'Start/DateTime',
        '$top': top
      }
    })
    console.log('Result of outlook.calendar.getEventsAsync: ', result)
    console.log('--- Конец получения событий ---')
    return { data: result.value }
  } catch (err) {
    const errObj = 
    console.log(`Ошибка получения событий: ${err.code}, ${err.message} full err (${typeof err}): ${err}`)
    return {
      error: {
        code: err.code, 
        message: err.message
      }
    }
  }
}

// get event by id
exports.getEvent = async (token, eventId) => {
  try {
    // Get the event from outlook api
    const result = await outlook.calendar.getEventAsync({
      token,
      eventId,
      useMe: true,
      odataParams: {
        '$select': 'Subject,Start,End,Attendees,Location'
      }
    })

    return { data: result }
  } catch (err) {
    return {
      error: {
        code: err.code,
        message: err.message
      }
    }
  }
}

// update event by id
exports.updateEvent = async (token, eventId, update) => {
  try {
    // Get the first 10 events for the coming week
    const result = await outlook.calendar.updateEventAsync({
      token,
      eventId,
      update,
      useMe: true
    })

    return { data: result }
  } catch (err) {
    return {
      error: {
        code: err.code,
        message: err.message
      }
    }
  }
}