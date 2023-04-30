var express = require('express')
var controller = require('../controllers/userlist.controller');
var router = express.Router();

router.get('/', controller.showHome);
router.get('/getUserById', controller.getUserById);

module.exports = router;