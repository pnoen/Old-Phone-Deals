var express = require('express')
var controller = require('../controllers/phonelisting.controller');
var router = express.Router();

router.get('/', controller.showHome);
router.get('/getSoldSoon', controller.getSoldSoon);
router.get('/getBestSeller', controller.getBestSeller);
router.get('/getPhone', controller.getPhone);
router.get('/getPhones', controller.getPhones);
router.get('/getBrandsList', controller.getBrandsList);
router.post('/addToCart', controller.addToCart);
router.get('/getCartItemQuantity', controller.getCartItemQuantity);
router.post('/updateMainState', controller.updateMainState);

module.exports = router;
