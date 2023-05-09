var express = require('express')
var controller = require('../controllers/userlist.controller');
var router = express.Router();

router.get('/', controller.showHome);

router.post('/checkLoginCredentials', controller.checkLoginCredentials);
router.post('/updateLoggedInState', controller.updateLoggedInState);
router.post('/toggleLoginRegister', controller.toggleLoginRegister);
router.get('/getUserById', controller.getUserById);

module.exports = router;
