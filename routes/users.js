const express = require('express')
const passport = require('passport')
const router = express.Router()
const CatchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const { storeReturnTo, isLoggedIn } = require('../middleware')
const userController = require('../controllers/users')

router.get('/register', userController.registerForm)

router.post('/register', CatchAsync(userController.registerUser))

router.get('/login', userController.loginForm)

router.get('/logout', isLoggedIn, userController.logoutUser);

router.post('/login', storeReturnTo, passport.authenticate('local', { failureflash: true, failureRedirect: '/login', }), userController.loginUser
)

module.exports = router