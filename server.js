var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var userlistRoutes = require("./app/routes/userlist.routes");
var phonelistingRoutes = require("./app/routes/phonelisting.routes");

var app = express();
app.locals.state = "home";
app.locals.cart = [];

app.set('views', path.join(__dirname,'/app/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user', userlistRoutes);
app.use('/', phonelistingRoutes);
app.listen(3000, function () {
	console.log('Revision app listening on port 3000!')
});
	
module.exports = app;