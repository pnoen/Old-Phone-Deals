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