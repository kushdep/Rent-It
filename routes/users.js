const express = require('express')
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
        req.flash('success', 'Welcome to RENT-IT')
        res.redirect('/rentloc')
    } catch (error) {
        req.flash('error',error.message)
        res.redirect('register')
    }
}))

module.exports = router