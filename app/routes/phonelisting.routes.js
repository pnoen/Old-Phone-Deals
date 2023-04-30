var express = require('express')
var controller = require('../controllers/phonelisting.controller');
var router = express.Router();

router.get('/', controller.showHome);
router.get('/getSoldSoon', controller.getSoldSoon);
router.get('/getBestSeller', controller.getBestSeller);
router.get('/getPhone', controller.getPhone);

module.exports = router;