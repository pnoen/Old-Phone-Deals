var phonelisting = require("../models/phonelisting");

module.exports.showHome = function (req, res) {
	let loggedIn = req.app.locals.loggedIn;
	let state = req.app.locals.state;
	let mainPageData = req.app.locals.mainPageData;
	let currentUser = req.app.locals.currentUser;
	res.render("main.ejs", {
		loggedIn: loggedIn,
		state: state,
		mainPageData: mainPageData,
		currentUser: currentUser
	});
}

module.exports.showSignIn = function(req, res) {
	let loggedIn = req.app.locals.loggedIn;
	let state = req.app.locals.state;
	let mainPageData = req.app.locals.mainPageData;
	let currentUser = req.app.locals.currentUser;
  res.render("signin.ejs", {
		loggedIn: loggedIn,
		state: state,
		mainPageData: mainPageData,
		currentUser: currentUser
	});
}

module.exports.showProfile = function(req, res) {
	let loggedIn = req.app.locals.loggedIn;
	let state = req.app.locals.state;
	let mainPageData = req.app.locals.mainPageData;
	let currentUser = req.app.locals.currentUser;
  res.render("user.ejs", {
		loggedIn: loggedIn,
		state: state,
		mainPageData: mainPageData,
		currentUser: currentUser
	});
}

module.exports.showCheckout = async function (req, res) {
	let loggedIn = req.app.locals.loggedIn;
	let state = req.app.locals.state;
	let mainPageData = req.app.locals.mainPageData;
	let currentUser = req.app.locals.currentUser;
	res.render("checkout.ejs", {
		loggedIn: loggedIn,
		cart: req.app.locals.cart,
		state: state,
		mainPageData: mainPageData,
		currentUser: currentUser
	});
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
	let cart = req.app.locals.cart;
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
	req.app.locals.cart = [];
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
	res.json(req.app.locals.cart);
}
module.exports.updateCart = function (req, res) {
	let phone = req.body.phone;
	let quantity = parseInt(req.body.quantity);

	let newItem = {
		phone: phone,
		quantity: quantity
	}
	if(quantity == 0){
		for(var i = 0; i< req.app.locals.cart.length; i++){
			if (req.app.locals.cart[i].phone.title == newItem.phone.title && req.app.locals.cart[i].phone.seller == newItem.phone.seller){
				req.app.locals.cart.splice(i, 1);
				res.send("Item Removed");
				return;
			}
		}
	}
	let exists = false;
	for (let item of req.app.locals.cart) {
		if (item.phone.title == newItem.phone.title && item.phone.seller == newItem.phone.seller) {
			item.quantity = newItem.quantity;
			exists = true;
			break;
		}
	}

	if (!exists) {
		req.app.locals.cart.push(newItem);
	}

	res.send("Cart updated");
}

module.exports.addToCart = function (req, res) {
	let phone = req.body.phone;
	let quantity = parseInt(req.body.quantity);

	let newItem = {
		phone: phone,
		quantity: quantity
	}

	let exists = false;
	for (let item of req.app.locals.cart) {
		if (item.phone.title == newItem.phone.title && item.phone.seller == newItem.phone.seller) {
			item.quantity += newItem.quantity;
			exists = true;
			break;
		}
	}

	if (!exists) {
		req.app.locals.cart.push(newItem);
	}

	res.send("Added to cart");
}

module.exports.getCartItemQuantity = function (req, res) {
	let title = req.query.title;
	let seller = req.query.seller;

	let data = {
		quantity: 0
	};

	for (let item of req.app.locals.cart) {
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

module.exports.updateMainState = function (req, res) {
	let state = req.body.state;
	let mainPageData = req.body.data;
	if (state == "home") {
		mainPageData = {};
	}

	req.app.locals.state = state;
	req.app.locals.mainPageData = mainPageData;

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
