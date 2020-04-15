
const moment = require( 'moment' );


const eventData = {
    name: "sfsdfsdf",
    date: moment("2020-04-16T18:01:53.678Z"),
    time: moment("2020-04-14T15:00:50.000Z"),
    color: "#e6d700",
    userId: "5e92702c807aa5006245cb5d",
    userEmail: "vidyakin.sergey@gmail.com",
    emailSend: false,
    attendees: [
       {
          "email": "5e91f258c76c6d002b496472"
       }
    ]
}
const googleToken = "ya29.a0Ae4lvC2j8T2Vy7IWivcNwiwdE0gZaS6gNXOInhAI06yReLIyAbvtjVOpJz_sX2mMSSvhhGqDOi4fAoBUlIQljBauqyKZJc014kdSIUxVpSdlsEWO5dNay1iNqVBMJObwwpmtxCpP3PDpwuMBOF11VC2JfGrhuRynw6kP"
const headers = {
    'Authorization': `Bearer ${googleToken}`,
};
// const targetTime = new Date(this.date.setHours(this.time.split(':')[0], this.time.split(':')[1])),
//     timeZoneFromDB = -2,
//     tzDifference = timeZoneFromDB * 60 + targetTime.getTimezoneOffset(),
//     offsetTime = new Date(targetTime.getTime() + tzDifference * 60 * 1000);
const time = {h: eventData.time.hour(), m: eventData.time.minute()} // shorthand val
eventData.date.hour(time.h).minute(time.m).utcOffset(3); // set hour&minute from time field to date field

const event = {
    summary: eventData.name,
    description: eventData.comment,
    start: {'dateTime': eventData}
    
};
if (eventData.attendees) event.attendees = eventData.attendees;

console.log(`>> event.js: 'event' is: ${JSON.stringify(event,null,2)}`)
