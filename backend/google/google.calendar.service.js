
// const {google} = require('googleapis');
// const jwt = require('jsonwebtoken');
// const oauth2Client = new google.auth.OAuth2(
//     "71908882835-8obuf5apvlu76kk84hvv8s8fluo7grqe.apps.googleusercontent.com",
//     "PBDrJ199A9eJwKRyGbpbtoX8",
//     "http://localhost:8080"
//   );
// const {tokens} = oauth2Client.getToken(code)
// oauth2Client.setCredentials(tokens);

// google.options({
//     auth: oauth2Client
// });
// const API_KEY = "AIzaSyCoShRDlxCIvYdMlYhAx8lSRrsE4uxiPLc";

// exports.listEvents = token => {
//     let decoded = jwt.decode(token).result;
//     const auth = decoded.googleToken;
//     console.log(`>> auth is ${auth}`);
    
//     const calendar = google.calendar({version: 'v3'});
//     const q = {
//         calendarId: 'primary',
//         timeMin: (new Date()).toISOString(),
//         maxResults: 10,
//         singleEvents: true,
//         orderBy: 'startTime',
//     }
//     calendar.events.list(q, (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       if (res) {
//         console.log(`res = ${res}`);
//         const events = res.data.items;
//         if (events.length) {
//             console.log('Upcoming 10 events:');
//             events.map((event, i) => {
//             const start = event.start.dateTime || event.start.date;
//             console.log(`${start} - ${event.summary}`);
//             });
//         } else {
//             console.log('No upcoming events found.');
//         }
//       } else {
//         console.log('None response  received');
//       }
//     });
//   }