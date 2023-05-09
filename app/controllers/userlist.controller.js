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


// Gets the id of the current user based on their email
module.exports.getCurrentUser = async function(req, res) {
  let email = req.query.email;

  userlist.getUserByEmail(email, function(err, result) {
  	if (err) {
  		console.log("Could not get the current user with email " + email);
  	} else {
  		res.json(result);
      req.app.locals.currentUser = result[0]._id;
  	}
  });
}


// Updates the logged in state
module.exports.updateLoggedInState = function(req, res) {
	let loggedIn = req.body.loggedIn;
	req.app.locals.loggedIn = (loggedIn === "true");
	res.send("Updated");
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


// Gets the user data for the profile page
module.exports.getUserData = async function(req, res) {
  let id = req.query.id;

  userlist.getUserData(id, function(err, result) {
  	if (err) {
  		console.log("Could not get the user data with id " + id);
  	} else {
  		res.json(result);
  	}
  });
}
