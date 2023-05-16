var mongoose = require('./db');
var bcrypt = require('bcrypt');

var userlistSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    isvalid: String
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


// Get the real password for this email for checking login
userlistSchema.statics.getLoginPasswordById = function(id, password, callback) {
  return this.find({ '_id': id }, { password: 1 }).exec(callback);
}


// Gets the user data for the profile page
userlistSchema.statics.getUserData = function (id, callback) {
  return this.find({ _id: id }, { firstname: 1, lastname: 1, email: 1 }).exec(callback);
}


// Updates the user's profile by id
userlistSchema.statics.updateProfile = function (id, firstname, lastname, email, callback) {
  return this.updateOne(
    { _id: id },
    { $set:
      {
        firstname: firstname, lastname: lastname, email: email
      }
    }).exec(callback);
}


// Updates the user's password by id
userlistSchema.statics.changePasswordById = function (id, password, callback) {
  return this.updateOne(
    { _id: id },
    { $set:
      {
        password: password
      }
    }).exec(callback);
}


// Updates the user's password by email
userlistSchema.statics.changePasswordByEmail = function (email, password, callback) {
  return this.updateOne(
    { email: email },
    { $set:
      {
        password: password
      }
    }).exec(callback);
}


// Registers the new user
userlistSchema.statics.registerNewUser = function (firstname, lastname, email, hashedPass) {
  return this.create({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: hashedPass
  });
}


// Checks the email is in use
userlistSchema.statics.checkEmailInUse = function(email, callback) {
  return this.find({ email: email }, { _id: 1 }).exec(callback);
}


// Checks the email is valid
userlistSchema.statics.checkEmailVerified = function(email, callback) {
  return this.find({ 'email': email, 'isvalid': {$exists: true}}).exec(callback);
}


// Verifies an email
userlistSchema.statics.verifyEmail = function (email, callback) {
  return this.updateOne(
    { email: email },
    { $set: {"isvalid": ""} }
  ).exec(callback);
}


var Userlist = mongoose.model('Userlist', userlistSchema, 'userlist');

module.exports = Userlist;
