const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const NotificationsSchema = new Schema({
userId: String,
addUser: { type: Boolean, default: false },
publications: { type: Boolean, default: false },
eventCalendar: { type: Boolean, default: false },
subscribe: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', NotificationsSchema);