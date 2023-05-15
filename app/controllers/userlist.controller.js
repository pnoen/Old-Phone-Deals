var userlist = require("../models/userlist");
var bcrypt = require('bcrypt');

function initialiseSessionVars(sess) {
	sess.state = "home";
	sess.cart = [];
	sess.mainPageData = [];
	sess.loggedIn = false;
	sess.currentUser = "";
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
module.exports.getCurrentUser = async function (req, res) {
  let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

  let email = req.query.email;

  userlist.getUserByEmail(email, function(err, result) {
  	if (err) {
  		console.log("Could not get the current user with email " + email);
    } else {
      sess.currentUser = result[0]._id;
  		res.json(result);
  	}
  });
}


// Updates the logged in state
module.exports.updateLoggedInState = function (req, res) {
  let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

	let loggedIn = req.body.loggedIn;
	sess.loggedIn = (loggedIn === "true");
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


// Checks the entered password against the real one
module.exports.checkPasswordById = async function(req, res) {
  var id = req.body.id;
  var password = req.body.password;

  await userlist.getLoginPasswordById(id, password, async function(err, result) {
    if (err) {
      console.log("DB error: Could not get login password by ID.");

    } else {
      realPassword = result;

      // Occurs when the id does not exist
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


// Updates the user profile
module.exports.updateProfile = async function(req, res) {
  var id = req.body.id;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;

  await userlist.updateProfile(id, firstname, lastname, email,
    async function(err, result) {

    if(err) {
      console.log("DB error: Could not update profile.");

    } else {
      res.send("Updated");
    }
  });
}


// Changes the user's password
module.exports.changePasswordById = async function(req, res) {
  var id = req.body.id;
  var password = req.body.password;
  var saltRounds = 5;

  let hashedPass = await bcrypt.hash(password, saltRounds);

  await userlist.changePasswordById(id, hashedPass, async function(err, result) {
    if (err) {
      console.log("DB error: Could not change password.");
    } else {
      res.send("Updated password.");
    }
  });
}


// Registers the new user
module.exports.registerNewUser = async function(req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;
  var saltRounds = 5;

  let hashedPass = await bcrypt.hash(password, saltRounds);

  // TODO: Check email does not exist yet

  await userlist.registerNewUser(firstname, lastname, email, hashedPass);
  res.send("New user registered");
}


module.exports.getCurrentUserId = async function (req, res) {
  let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

  let data = {
    currentUser: sess.currentUser
  }
  res.json(data);
}