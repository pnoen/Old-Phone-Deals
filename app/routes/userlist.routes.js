var express = require('express')
var controller = require('../controllers/userlist.controller');
var router = express.Router();

router.post('/checkLoginCredentials', controller.checkLoginCredentials);
router.post('/checkPasswordById', controller.checkPasswordById);
router.post('/updateLoggedInState', controller.updateLoggedInState);
router.post('/updateProfile', controller.updateProfile);
router.post('/changePasswordById', controller.changePasswordById);
router.post('/changePasswordByEmail', controller.changePasswordByEmail);
router.post('/registerNewUser', controller.registerNewUser);
router.get('/getUserById', controller.getUserById);
router.get('/getCurrentUser', controller.getCurrentUser);
router.get('/getUserData', controller.getUserData);
router.get('/getCurrentUserId', controller.getCurrentUserId);
router.get('/checkEmailInUse', controller.checkEmailInUse);
router.get('/checkEmailVerified', controller.checkEmailVerified);
router.get('/verifyEmail/:email/:uniqueString', controller.verifyEmail);
router.get('/sendVerification', controller.sendVerification);
router.get('/sendPassChange', controller.sendPassChange);
router.get('/changePassword/:email/:uniqueString', controller.changePassword);
router.post('/updatePassword', controller.updatePassword)

module.exports = router;
