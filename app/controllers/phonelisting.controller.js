var phonelisting = require("../models/phonelisting");

module.exports.showHome = function (req, res) {
	res.render("home.ejs")
}