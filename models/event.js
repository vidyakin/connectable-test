const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');
const user = require('./user');

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
  user.findOne({_id: this.userId}).catch(err => console.log(err)).then(data => {

    const headers = {
      'Authorization': `Bearer ${data.googleToken}`,
    };
    const event = {
      description: this.comment,
      start: {'dateTime': new Date(this.date.setHours(this.time.split(':')[0], this.time.split(':')[1]))},
      end: {'dateTime': new Date(this.date.setHours(this.time.split(':')[0], this.time.split(':')[1]))},
      summary: this.name
    };
    if(this.attendees) event.attendees = this.attendees;

    axios
      .post('https://www.googleapis.com/calendar/v3/calendars/primary/events',
        event, {headers: headers})
      .catch(e => {
        next();
      })
      .then((data) => {
        this.googleEventId = data.data.id;
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