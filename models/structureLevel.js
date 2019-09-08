const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const structureSection = new Schema({
    name: String,
    type: String,
    users: Object,
    sections: Object,
    code: 'section'
});

module.exports = mongoose.model('structureSection', structureSection);