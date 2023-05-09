var express = require('express')
var controller = require('../controllers/userlist.controller');
var router = express.Router();

router.get('/', controller.showHome);

router.post('/checkLoginCredentials', controller.checkLoginCredentials);
router.post('/updateLoggedInState', controller.updateLoggedInState);
router.get('/getUserById', controller.getUserById);
router.get('/getCurrentUser', controller.getCurrentUser);
router.get('/getUserData', controller.getUserData);

module.exports = router;
