var userlist = require("../models/userlist")

module.exports.showHome = function (req, res) {
    res.render("user.ejs");
}