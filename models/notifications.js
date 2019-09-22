const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const settingsNotifications = new Schema({
name: String,
type: String,
status: { type: Boolean, default: false }
});

module.exports = mongoose.model('settingsNotifications', settingsNotifications);