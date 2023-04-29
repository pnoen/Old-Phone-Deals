var express = require('express')
var controller = require('../controllers/phonelisting.controller');
var router = express.Router();

router.get('/', controller.showHome);
router.get('/getSoldSoon', controller.getSoldSoon);
router.get('/getBestSeller', controller.getBestSeller);

module.exports = router;