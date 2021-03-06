const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');
const user = require('./user');
const { google } = require('googleapis');
const {safeStringify} = require('@/utils');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

// schema maps to a collection
const Schema = mongoose.Schema;

const eventsEndPoint = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

const eventSchema = new Schema({
  client_id: String,       // код клиента
  userId: String,
  name: String,
  date: Date,
  end: Date,
  time: String, // вроде как не нужна, чисто декоративно выводится
  duration: String,  // 20 minutes, 60 minutes и т.д.
  comment: String,
  color: String,
  googleEventId: String,
  attendees: Array
});

/*Bearer*/
eventSchema.pre('save', function (next) {
  console.log(`events pre Save on back: this ${JSON.stringify(this,null,3)}`);
  
  user.findOne({_id: this.userId})
  .catch(err => console.log(err))
  .then(data => {
    console.log(`Bearer ${data.googleToken}`);
    
    const headers = {
      'Authorization': `Bearer ${data.googleToken}`,
    };
    // const targetTime = new Date(this.date.setHours(this.time.split(':')[0], this.time.split(':')[1])),
    //     timeZoneFromDB = -2,
    //     tzDifference = timeZoneFromDB * 60 + targetTime.getTimezoneOffset(),
    //     offsetTime = new Date(targetTime.getTime() + tzDifference * 60 * 1000);
    const event = {
      description: this.comment,
      start: {'dateTime': this.date},
      end: {'dateTime': this.end},
      summary: this.name,
      attendees: this.attendees ? this.attendees : []
    };

    //if (this.attendees) event.attendees = this.attendees;
    //console.log(`>> event.js: 'event' is: ${JSON.stringify(event,null,2)}`)

    axios
      .post(eventsEndPoint, event, {headers: headers})
      .then(_d => {        
        console.log(`>> event.js: in axios's «then» '_d' is: ${safeStringify(_d.data)}`)
        this.googleEventId = _d.data.id;
        next();
      })
      .catch(e => {
        console.log(`>> event.js: in axios's catch error: ${e.message}`)
        next();
      })
  })
});

eventSchema.pre('deleteOne', { query: true, document: true }, function(next) {
  this.findOne({_id: this._conditions._id}).catch(e => {})
    .then(event => {
      user
      .findOne({_id: event.userId}).catch(err => console.log(err))
      .then(data => {
        const headers = {
          'Authorization': `Bearer ${data.googleToken}`,
        };

        axios
          .delete(eventsEndPoint + event.googleEventId, {headers: headers})
          .catch(e => { next(); })
          .then((data) => { next(); })
      })
  });

})

eventSchema.pre('updateOne', { query: true, document: true }, async function(next) {
  try {
    // "this" is a huge JSON object of 4.5k lines
    // const theevent = this._update
    // Чтобы не делать лишний запрос данные о событии есть в поле "this._update",
    // но почему-то там нет поля googleToken, приходится делать запроск базе
    let theevent = await this.findOne({_id: this._conditions._id})
    if (theevent.googleEventId == undefined) return next() // EXIT if no google ID exists

    // берем токен
    const thisuser = await user.findOne({_id: theevent.userId})
    if (thisuser.googleToken == undefined) return next() // EXIT if user has no google token
    
    const headers = {
      'Authorization': `Bearer ${thisuser.googleToken}`,
    };
    theevent = this._update // берем данные из поступивших данных, а не найденных в базе
    const event = {
      description: theevent.comment,
      start: {'dateTime': theevent.date},
      end: {'dateTime': theevent.end},
      summary: theevent.name,
      attendees: theevent.attendees ? theevent.attendees : []
    };
    await axios.put(eventsEndPoint+'/'+ theevent.googleEventId, event, { headers })
    console.log(`Event was updated normally`);
    next()
  } catch (error) {
    console.log(`Error while update event in Google: ${error}`);            
    next(error) 
  }

})

module.exports = mongoose.model('Event', eventSchema);