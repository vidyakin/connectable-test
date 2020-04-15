const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');
const user = require('./user');
const { google } = require('googleapis');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

// schema maps to a collection
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  userId: String,
  name: String,
  date: Date,
  time: String,
  duration: String,
  comment: String,
  color: String,
  googleEventId: String,
  attendees: Array
});
/*Bearer*/
eventSchema.pre('save', function (next) {
  //console.log(`events pre Save on back: this ${JSON.stringify(this,null,3)}`);
  
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
      end: {'dateTime': this.date},
      summary: this.name
    };

    if(this.attendees) event.attendees = this.attendees;
    //console.log(`>> event.js: 'event' is: ${JSON.stringify(event,null,2)}`)

    const safeStringify = val => {
      let cache = []
      const f = (key, value) => {
          if (typeof value === 'object' && value !== null) {
              if (cache.indexOf(value) !== -1) {
                  // Duplicate reference found, discard key
                  return;
              }
              // Store value in our collection
              cache.push(value);
          }
          return value;
      }
      let strD = JSON.stringify(val, f, 3);
      cache = null;
      return strD;
    }
    
    axios
      .post('https://www.googleapis.com/calendar/v3/calendars/primary/events',
        event, {headers: headers})
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
      user.findOne({_id: event.userId}).catch(err => console.log(err)).then(data => {
        const headers = {
          'Authorization': `Bearer ${data.googleToken}`,
        };

        axios
          .delete('https://www.googleapis.com/calendar/v3/calendars/primary/events/' + event.googleEventId,
            {headers: headers})
          .catch(e => {
            next();
          })
          .then((data) => {
            next();
          })

      })
  });

})

module.exports = mongoose.model('Event', eventSchema);