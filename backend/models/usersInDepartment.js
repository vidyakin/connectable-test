const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const environment = process.env.NODE_ENV;

// schema maps to a collection
const Schema = mongoose.Schema;

const sc = new Schema({
  client_id: String, // код клиента
  dept_id: String,  // код отдела
  users: Array, // сотрудники отдела
  headUser: String  // начальник отдела - код сотрудника
});


module.exports = mongoose.model('UsersInDepartment', sc);