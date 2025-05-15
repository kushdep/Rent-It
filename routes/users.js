const express = require('express')
const passport = require('passport')
const router = express.Router()
const CatchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const { storeReturnTo } = require('../middleware')

router.get('/register', async (req, res) => {
  res.render('users/register')
})

router.post('/register', CatchAsync(async (req, res) => {
  try {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err)
      }
      req.flash('success', 'Welcome to RENT-IT')
      res.redirect('/rentloc')
    })
  } catch (error) {
    req.flash('error', error.message)
    res.redirect('register')
  }
}))

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Goodbye!');
    res.redirect('/rentloc');
  });
});

router.post('/login', storeReturnTo, passport.authenticate('local', { failureflash: true, failureRedirect: '/login' }), (req, res) => {
  const redirectUrl = res.locals.returnTo || '/rentloc'
  res.redirect(redirectUrl)
})

module.exports = router