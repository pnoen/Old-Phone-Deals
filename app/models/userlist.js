var mongoose = require('./db');

var userlistSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String
})

var Userlist = mongoose.model('Userlist', userlistSchema, 'userlist');

module.exports = Userlist;