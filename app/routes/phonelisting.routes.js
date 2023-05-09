var express = require('express')
var controller = require('../controllers/phonelisting.controller');
var router = express.Router();

// Pages
router.get('/', controller.showHome);
router.get('/signin', controller.showSignIn);
router.get('/checkout', controller.showCheckout);
router.get('/profile', controller.showProfile);

router.get('/getSoldSoon', controller.getSoldSoon);
router.get('/getBestSeller', controller.getBestSeller);
router.get('/getPhone', controller.getPhone);
router.get('/getPhones', controller.getPhones);
router.get('/getBrandsList', controller.getBrandsList);
router.post('/addToCart', controller.addToCart);
router.get('/getCartItemQuantity', controller.getCartItemQuantity);
router.get('/getHighestPrice', controller.getHighestPrice);
router.post('/updateMainState', controller.updateMainState);
<<<<<<< HEAD
=======
router.get('/checkout', controller.showCheckout);
router.post('/updateCart', controller.updateCart);
router.get('/getCart', controller.getCart);
router.post('/buyPhone', controller.buyPhone);
>>>>>>> main

module.exports = router;
