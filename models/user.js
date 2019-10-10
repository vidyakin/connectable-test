const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

// schema maps to a collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: 'String',
        trim: true,
    },
    password: {
        type: 'String',
        trim: true,
    },
    email: String,
    phone: String,
    positions: Array,
    googleImage: String,
    googleToken: String,
    firstName: String,
    lastName: String,
    googleId: Number,
    followers: Array,
    followersEmail: Array
});

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified || !user.isNew) { // don't rehash if it's an old user
        next();
    } else {
        bcrypt.hash(user.password, 10, function (err, hash) {
            if (err) {
                console.log('Error hashing password for user', user.name);
                next(err);
            } else {
                user.password = hash;
                next();
            }
        });
    }
});

module.exports = mongoose.model('User', userSchema);