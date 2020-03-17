const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    name: String,
    parent: Object,
    users: Array,
    slug: String,
    level: Number
});

module.exports = mongoose.model('Department', departmentSchema);