const express = require('express')
const passport = require('passport')
const router = express.Router()
const CatchAsync = require('../utils/catchAsync')
const User = require('../models/user')

router.get('/register', async (req, res) => {
    res.render('users/register')
})

router.post('/register', CatchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser,(err)=>{
          if(err){
            return next(err)
          }
          req.flash('success', 'Welcome to RENT-IT')
          res.redirect('/rentloc')
        })
    } catch (error) {
        req.flash('error',error.message)
        res.redirect('register')
    }
}))

router.get('/login',(req,res)=>{
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

router.post('/login',passport.authenticate('local',{failureflash:true, failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome back')
    res.redirect('/rentloc')
})

module.exports = router