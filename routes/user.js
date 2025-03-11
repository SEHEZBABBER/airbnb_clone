const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js');
const Passport = require('passport');
const {isLoggedin, save_url} = require('../middleware/middleware.js');
const {validateUser} = require('../middleware/middleware.js');
const userController = require('../controllers/user.js');
// for signing up
router.router('/signup')
    .get(userController.form_signup)
    .post('/signup',validateUser,wrapAsync(userController.post_signup));
// for login form
router.router('/login')
    .get('/login',userController.form_login)
    .post(save_url,validateUser,Passport.authenticate("local", {
    failureRedirect : '/login',
    failureFlash : true,
}),userController.post_login);
// for logging out
router.get('/logout',isLoggedin,userController.log_out);
module.exports = router;