const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//mongoose.connect('mongodb://user:secret1@ds133621.mlab.com:33621/aleseyko', {useNewUrlParser: true});
console.log(`DB_URL: ${process.env.DB_URL}`);

mongoose.connect(process.env.DB_URL || db, {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

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
index.Project = require('./project');
index.GroupParticipant = require('./groupParticipant');
index.ProjectParticipant = require('./projectParticipant');
index.GroupInvite = require('./groupInvite');
index.Department = require('./department');
index.Notification = require('./notification');
index.Message = require('./message');
index.Structure = require('./structure');
module.exports = index;