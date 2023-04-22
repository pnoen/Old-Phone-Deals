var userlist = require("../models/userlist")

module.exports.showHome = function(req,res){
    res.render("home.ejs");
}