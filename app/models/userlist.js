var mongoose = require('./db');
var bcrypt = require('bcrypt');

var userlistSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String
})

userlistSchema.statics.getUserById = function (id, callback) {
  return this.find({
    '_id': mongoose.Types.ObjectId(id)})
    .limit(1)
    .exec(callback)
}


// Gets the current user id based on the email
userlistSchema.statics.getUserByEmail = function (email, callback) {
  return this.find({ email: email }, { '_id': 1 }).exec(callback);
}


// Get the real password for this email for checking login
userlistSchema.statics.getLoginPassword = function(email, password, callback) {
  return this.find({ email: email }, { password: 1 }).exec(callback);
}


// Gets the user data for the profile page
userlistSchema.statics.getUserData = function (id, callback) {
  return this.find({ _id: id }, { firstname: 1, lastname: 1, email: 1 }).exec(callback);
}


var Userlist = mongoose.model('Userlist', userlistSchema, 'userlist');

module.exports = Userlist;
