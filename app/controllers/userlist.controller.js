var userlist = require("../models/userlist");
var bcrypt = require('bcrypt');

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

// Checks the entered password against the real one
module.exports.checkLoginCredentials = async function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  await userlist.getLoginPassword(email, password, async function(err, result) {
    if(err) {
      console.log("DB error: Login credentials failed.");

    } else {
      realPassword = result;

      // Occurs when the email does not exist
      if (result.length === 0) {
        res.json(false);
        return;
      }

      // Compare the real and entered passwords
      var realPassword = result[0].password;
      await bcrypt.compare(password, realPassword, function(err2, result2) {
        res.json(result2);
      });
    }
  });
}
