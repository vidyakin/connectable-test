const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const structureDepartment = new Schema({
    name: String,
    type: String,
    users: Object,
    code: 'department'
});

module.exports = mongoose.model('structureDepartment', structureDepartment);