var phonelisting = require("../models/phonelisting");

module.exports.showHome = async function (req, res) {
	// TODO loggedIn is a placeholders, maybe move the app.locals
	let state = req.app.locals.state;
	res.render("main.ejs", { loggedIn: false, state: state });
}

module.exports.getSoldSoon = async function (req, res) {
	phonelisting.find5LeastQuantityAvaliable(function (err, result) {
		if (err) {
			console.log("db error");
		}
		else {
			res.json(result);
		}
	});
}

module.exports.getBestSeller = async function (req, res) {
	phonelisting.find5HighestAverageRating(function (err, result) {
		if (err) {
			console.log("db error");
		}
		else {
			res.json(result);
		}
	});
}

module.exports.getPhone = async function (req, res) {
	title = req.query.title;
	seller = req.query.seller;

	phonelisting.findPhone(title, seller, function (err, result) {
		if (err) {
			console.log("db error");
		}
		else {
			res.json(result);
		}
	});
}

module.exports.getPhones = async function (req, res) {
	searchTerm = req.query.searchTerm;
	console.log(searchTerm);
	brand = req.query.brand;
	maxPrice = req.query.maxPrice;

	phonelisting.getPhones(searchTerm, brand, maxPrice, function (err, result) {
		if (err) {
			console.log("db error");
		}
		else {
			res.json(result);
		}
	});
}

module.exports.getBrandsList = async function (req, res) {
  phonelisting.getListOfBrands(function (err, result) {
    if (err) {
    	console.log("Could not get the list of brands.");
    } else {
    	res.json(result);
    }
  });
}

module.exports.updateMainState = async function (req, res) {
	state = req.body.state;
	req.app.locals.state = state;
	res.send("updated");
}
