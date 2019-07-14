const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.connect('mongodb://user:secret1@ds133621.mlab.com:33621/aleseyko', {useNewUrlParser: true});


const jokesSchema = new Schema({
        content: String,
        created: {type: Date, default: Date.now}
    },
    {strict: false}
);

const index = {};
index.Jokes = mongoose.model('jokes', jokesSchema);
index.User = require('./user');
index.Post = require('./post');
index.Like = require('./like');
index.Comment = require('./comment');
index.Event = require('./event');
index.Group = require('./group');

module.exports = index;