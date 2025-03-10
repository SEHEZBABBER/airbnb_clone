const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js');
const Passport = require('passport');
const {isLoggedin, save_url} = require('../middleware/middleware.js');
const userController = require('../controllers/user.js');
// for signing up
router.get('/signup',userController.form_signup);
// for posting sign up
router.post('/signup',wrapAsync(userController.post_signup));
// for login form
router.get('/login',userController.form_login);
// for posting login form
router.post('/login',save_url,Passport.authenticate("local", {
    failureRedirect : '/login',
    failureFlash : true,
}),userController.post_login);
// for logging out
router.get('/logout',isLoggedin,userController.log_out);
module.exports = router;