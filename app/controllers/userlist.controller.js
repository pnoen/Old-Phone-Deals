var userlist = require("../models/userlist")

module.exports.showHome = function (req, res) {
  res.render("user.ejs");
}

module.exports.getUserById = async function (req, res) {
  let id = req.query.id;

  userlist.getUserById(id, function (err, result) {
  	if (err) {
  		console.log("db error");
  	}
  	else {
  		res.json(result);
  	}
  });
}
