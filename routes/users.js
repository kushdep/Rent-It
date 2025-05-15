const express = require('express')
const passport = require('passport')
const router = express.Router()
const CatchAsync = require('../utils/catchAsync')
const { storeReturnTo, isLoggedIn } = require('../middleware')
const userController = require('../controllers/users')

router.route('/register')
    .get(userController.registerForm)
    .post(CatchAsync(userController.registerUser))

router.route('/login')
    .get(userController.loginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', }), userController.loginUser
    )

router.get('/logout', isLoggedIn, userController.logoutUser);

module.exports = router