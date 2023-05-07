var phonelisting = require("../models/phonelisting");

module.exports.showHome = function (req, res) {
	// TODO loggedIn is a placeholders, maybe move the app.locals
	let state = req.app.locals.state;
	res.render("main.ejs", { loggedIn: false, state: state });
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

module.exports.getPhones = function (req, res) {
	let searchTerm = req.query.searchTerm;
	// console.log(searchTerm);
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

module.exports.updateMainState = function (req, res) {
	let state = req.body.state;
	req.app.locals.state = state;
	res.send("updated");
}
