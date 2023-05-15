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
router.get('/checkout', controller.showCheckout);
router.post('/updateCart', controller.updateCart);
router.get('/getCart', controller.getCart);
router.post('/buyPhone', controller.buyPhone);
router.post('/setHiddenReviewByTitleAndSeller', controller.setHiddenReviewByTitleAndSeller);
router.post('/unsetHiddenReviewByTitleAndSeller', controller.unsetHiddenReviewByTitleAndSeller);
router.post('/addNewListing', controller.addNewListing);
router.get('/getListingsByUser', controller.getListingsByUser);
router.get('/getUsersComments', controller.getUsersComments);
router.post('/disableListing', controller.disableListing);
router.post('/enableListing', controller.enableListing);
router.post('/removeListing', controller.removeListing);
router.post('/addReview', controller.addReview);
router.post('/hideComment', controller.hideComment);
router.post('/showComment', controller.showComment);


module.exports = router;
