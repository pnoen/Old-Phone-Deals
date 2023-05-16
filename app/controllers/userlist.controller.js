var userlist = require("../models/userlist");
var bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
var {v4: uuidv4} = require("uuid");

require("dotenv").config();

//mailer transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_APPPASS,
  },
  tls: {
    rejectUnauthorized: false
  }
})

transporter.verify((error, success) => {
  if(error){
    console.log(error);
    console.log(process.env.AUTH_PASS);
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
})

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


module.exports.changePassword = async function(req, res) {
  //prompt("HELLO");
  let {email, uniqueString} = req.params;
  //await userlist.checkPassRequest
  res.render('passwordChange.ejs', {email:email, uniqueString:uniqueString});
}

// Changes the user's password
module.exports.changePasswordByEmail = async function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var uniqueString = req.body.uniqueString;
  var saltRounds = 5;

  let hashedPass = await bcrypt.hash(password, saltRounds);

  await userlist.changePasswordByEmail(email, uniqueString, hashedPass, async function(err, result) {
    if (err) {
      console.log("DB error: Could not change password.");
    } else {
      res.send("Updated password.");
    }
  });
}

module.exports.sendPassChange = async function(req, res) {
  var email = req.query.email;
  
  const currUrl = "http://localhost:3000/";
  const uniqueString = uuidv4();

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Update your password",
    html: `<p>Password change requested</p>
    <p>Press: </p> <a href=${currUrl + "user/changePassword/" + email + "/" + uniqueString}> Here </a>`
  }
  transporter.sendMail(mailOptions)
  .then()
  .catch((error) => {
    res.json({
      status: "FAILED",
      message: "Email failed",
    })
  })

  userlist.setUniqueString(email, uniqueString, function (err, result) {
		if (err) {
			console.log("DB Error: Could not set verification string");
		} else {
			res.send("Verification string set");
		}
	});
}

module.exports.sendVerification = async function(req, res) {
  var email = req.query.email;
  
  const currUrl = "http://localhost:3000/";
  const uniqueString = uuidv4();

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "verify your email",
    html: `<p>Verify your email address to complete signup</p>
    <p>Press: </p> <a href=${currUrl + "user/verifyEmail/" + email + "/" + uniqueString}> Here </a>`
  }
  transporter.sendMail(mailOptions)
  .then()
  .catch((error) => {
    res.json({
      status: "FAILED",
      message: "Email failed",
    })
  })

  userlist.setUniqueString(email, uniqueString, function (err, result) {
		if (err) {
			console.log("DB Error: Could not set verification string");
		} else {
			res.send("Verification string set");
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


// Checks if the current email is in use already
module.exports.checkEmailInUse = async function(req, res) {
  let email = req.query.email;

  userlist.checkEmailInUse(email, function(err, result) {
  	if (err) {
  		console.log("DB Error: Could not check the email is in use " + email);
  	} else {
      if (result.length === 0) {
        res.json(true);
      } else {
        res.json(false);
      }
  	}
  });
}


// Gets all the comments for listings by a certain user
module.exports.checkEmailVerified = function (req, res) {
	var email = req.query.email;

	userlist.checkEmailVerified(email, function (err, result) {
		if (err) {
			console.log("DB Error: Could not check email is valid.");
		} else {
      res.json(result);
		}
	});
}


// Verifies an email
module.exports.verifyEmail = function (req, res) {
	//var email = req.body.email;
  let {email, uniqueString} = req.params;
	userlist.verifyEmail(email, uniqueString, function (err, result) {
		if (err) {
			console.log("DB Error: Could not verify the email.");
		} else {
			res.send("Verified");
		}
	});
}

module.exports.updatePassword = function (req, res) {
  let password = req.body.password;
  console.log(password);
  res.send("test");
}
