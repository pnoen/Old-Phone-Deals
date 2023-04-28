var phonelisting = require("../models/phonelisting");

module.exports.showHome = function (req, res) {
	// loggedIn and state are placeholders
	res.render("main.ejs", { loggedIn: false, state: "search" });
}