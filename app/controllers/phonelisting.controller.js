var phonelisting = require("../models/phonelisting");

function initialiseSessionVars(sess) {
	sess.state = "home";
	sess.cart = [];
	sess.mainPageData = {};
	sess.loggedIn = false;
	sess.currentUser = "";
}

module.exports.showHome = function (req, res) {
	let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

	let loggedIn = sess.loggedIn;
	let state = sess.state;
	let mainPageData = sess.mainPageData;
	let currentUser = sess.currentUser;
	res.render("main.ejs", {
		loggedIn: loggedIn,
		state: state,
		mainPageData: mainPageData,
		currentUser: currentUser
	});
}

module.exports.showSignIn = function(req, res) {
	let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

	let loggedIn = sess.loggedIn;
	let state = sess.state;
	let mainPageData = sess.mainPageData;
	let currentUser = sess.currentUser;
  res.render("signin.ejs", {
		loggedIn: loggedIn,
		state: state,
		mainPageData: mainPageData,
		currentUser: currentUser
	});
}

module.exports.showProfile = function (req, res) {
	let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

	let loggedIn = sess.loggedIn;
	let state = sess.state;
	let mainPageData = sess.mainPageData;
	let currentUser = sess.currentUser;
	if (loggedIn == false) {
		res.redirect("/signin");
	}
	else {
		res.render("user.ejs", {
			loggedIn: loggedIn,
			state: state,
			mainPageData: mainPageData,
			currentUser: currentUser
		});
	}
}

module.exports.showCheckout = async function (req, res) {
	let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

	let loggedIn = sess.loggedIn;
	let cart = sess.cart;
	let state = sess.state;
	let mainPageData = sess.mainPageData;
	let currentUser = sess.currentUser;
	if (loggedIn == false) {
		res.redirect("/signin");
	}
	else {
		res.render("checkout.ejs", {
			loggedIn: loggedIn,
			cart: cart,
			state: state,
			mainPageData: mainPageData,
			currentUser: currentUser
		});
	}
	
}

module.exports.getSoldSoon = function (req, res) {
	phonelisting.find5LeastQuantityAvaliable(function (err, result) {
		if (err) {
			console.log("db error");
		}
		else {
			res.json(result);
		}
	});
}

module.exports.getBestSeller = function (req, res) {
	phonelisting.find5HighestAverageRating(function (err, result) {
		if (err) {
			console.log("db error");
		}
		else {
			res.json(result);
		}
	});
}

module.exports.getPhone = function (req, res) {
	let title = req.query.title;
	let seller = req.query.seller;

	phonelisting.findPhone(title, seller, function (err, result) {
		if (err) {
			console.log("db error");
		}
		else {
			res.json(result);
		}
	});
}

module.exports.buyPhone = function (req, res) {
	let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

	let cart = sess.cart;
	
	for(item of cart){
		phonelisting.buyPhone(item.phone.title, item.phone.seller, item.quantity, function (err, result) {
			if (err) {
				console.log("db error");
			}
			else {
				console.log("bought "+ item.phone.title);
			}
		});
	}
	sess.cart = [];
	res.json("Done");
}

module.exports.getPhones = function (req, res) {
	let searchTerm = req.query.searchTerm;
	let brand = req.query.brand;
	let maxPrice = req.query.maxPrice;

	phonelisting.getPhones(searchTerm, brand, maxPrice, function (err, result) {
		if (err) {
			console.log("db error");
		}
		else {
			res.json(result);
		}
	});
}

module.exports.getBrandsList = function (req, res) {
  phonelisting.getListOfBrands(function (err, result) {
    if (err) {
    	console.log("Could not get the list of brands.");
    } else {
    	res.json(result);
    }
  });
}
module.exports.getCart = function (req, res) {
	let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

	let cart = sess.cart;
	res.json(cart);
}
module.exports.updateCart = function (req, res) {
	let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

	let phone = req.body.phone;
	let quantity = parseInt(req.body.quantity);

	let newItem = {
		phone: phone,
		quantity: quantity
	}
	if(quantity == 0){
		for(var i = 0; i< sess.cart.length; i++){
			if (sess.cart[i].phone.title == newItem.phone.title && sess.cart[i].phone.seller == newItem.phone.seller){
				sess.cart.splice(i, 1);
				res.send("Item Removed");
				return;
			}
		}
	}
	let exists = false;
	for (let item of sess.cart) {
		if (item.phone.title == newItem.phone.title && item.phone.seller == newItem.phone.seller) {
			item.quantity = newItem.quantity;
			exists = true;
			break;
		}
	}

	if (!exists) {
		sess.cart.push(newItem);
	}

	res.send("Cart updated");
}

module.exports.addToCart = function (req, res) {
	let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

	let phone = req.body.phone;
	let quantity = parseInt(req.body.quantity);

	let newItem = {
		phone: phone,
		quantity: quantity
	}

	let exists = false;
	for (let item of sess.cart) {
		if (item.phone.title == newItem.phone.title && item.phone.seller == newItem.phone.seller) {
			item.quantity += newItem.quantity;
			exists = true;
			break;
		}
	}

	if (!exists) {
		sess.cart.push(newItem);
	}

	res.send("Added to cart");
}

module.exports.getCartItemQuantity = function (req, res) {
	let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

	let title = req.query.title;
	let seller = req.query.seller;

	let data = {
		quantity: 0
	};

	for (let item of sess.cart) {
		if (item.phone.title == title && item.phone.seller == seller) {
			data.quantity = item.quantity;
			break;
		}
	}

	res.json(data);
}

module.exports.getHighestPrice = function (req, res) {
	phonelisting.getHighestPrice(function (err, result) {
		if (err) {
			console.log("db error");
		} else {
			res.json(result);
		}
	  });
}

module.exports.setHiddenReview = function (req, res) {
	let title = req.body.title;
	let seller = req.body.seller;
	let reviewIndex = req.body.reviewIndex;

	phonelisting.setHiddenReview(title, seller, reviewIndex, function (err, result) {
		if (err) {
			console.log("db error");
		} else {
			res.send("hidden status set");
			
		}
	})
}

module.exports.unsetHiddenReview = function (req, res) {
	let title = req.body.title;
	let seller = req.body.seller;
	let reviewIndex = req.body.reviewIndex;
	phonelisting.unsetHiddenReview(title, seller, reviewIndex, function (err, result) {
		if (err) {
			console.log("db error");
		} else {
			res.send("hidden status unset");
		}
	})
}

module.exports.updateMainState = function (req, res) {
	let sess = req.session;
	if (!(sess && "state" in sess)) {
		initialiseSessionVars(sess)
	}

	let state = req.body.state;
	let mainPageData = req.body.data;
	if (state == "home") {
		mainPageData = {};
	}

	sess.state = state;
	sess.mainPageData = mainPageData;

	res.send("updated");
}


// Adds the new listing
module.exports.addNewListing = async function(req, res) {
  var title = req.body.title;
  var brand = req.body.brand;
  var image = req.body.image;
  var stock = req.body.stock;
  var seller = req.body.seller;
	var price = req.body.price;
	var reviews = [];

  await phonelisting.addNewListing(title, brand, image, stock, seller, price, reviews);
  res.send("New listing added");
}


// Gets all the listings for the current user
module.exports.getListingsByUser = function (req, res) {
	var id = req.query.id;

	phonelisting.getListingsByUser(id, function (err, result) {
		if (err) {
			console.log("DB Error: Could not get the listings for the current user.");
		}
		else {
			res.json(result);
		}
	});
}


// Gets all the comments for listings by a certain user
module.exports.getUsersComments = function (req, res) {
	var id = req.query.id;

	phonelisting.getUsersComments(id, function (err, result) {
		if (err) {
			console.log("DB Error: Could not get the comments for the user.");
		}
		else {
			res.json(result);
		}
	});
}


// Disables listing by id
module.exports.disableListing = function (req, res) {
	var id = req.body.id;

	phonelisting.disableListing(id, function (err, result) {
		if (err) {
			console.log("DB Error: Could not disable the listing.");
		}
		else {
			res.send("Disabled");
		}
	});
}


// Enables listing by id
module.exports.enableListing = function (req, res) {
	var id = req.body.id;

	phonelisting.enableListing(id, function (err, result) {
		if (err) {
			console.log("DB Error: Could not enable the listing.");
		}
		else {
			res.send("Enabled");
		}
	});
}


// Removes listing by id
module.exports.removeListing = function (req, res) {
	var id = req.body.id;

	phonelisting.removeListing(id, function (err, result) {
		if (err) {
			console.log("DB Error: Could not remove the listing.");
		}
		else {
			res.send("Removed");
		}
	});
}
