const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.connect('mongodb://user:secret1@ds147842.mlab.com:47842/lex-db', {useNewUrlParser: true});


const jokesSchema = new Schema({
        content: String,
        created: {type: Date, default: Date.now}
    },
    {strict: false}
);

const index = {};
index.Jokes = mongoose.model('jokes', jokesSchema);
index.User = require('./user');

module.exports = index;