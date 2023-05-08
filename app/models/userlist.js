var mongoose = require('./db');

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

var Userlist = mongoose.model('Userlist', userlistSchema, 'userlist');

module.exports = Userlist;
