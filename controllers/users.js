const passport = require('passport')
const User = require('../models/user')

module.exports.registerForm = async (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res) => {
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
}

module.exports.loginForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    const redirectUrl = res.locals.returnTo || '/rentloc'
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/rentloc');
    });
}

module.exports.getMyBookings = async (req, res) => {
    res.render('rentloc/renters')
}

module.exports.getRentersData = async (req, res) => {
    const { id, reqState } = req.params
    const buttonValues = ['Pending', 'Approved', 'Declined']
    const activeBtn = reqState

    const user = await User.findById(id).populate('requests.location')
    const reqLoc = user.requests.filter(e => e.reqStatus === reqState)
    console.log(reqLoc)

    res.render('rentloc/renters', { buttonValues, id, activeBtn, reqLoc })
}

module.exports.setReqLocStts = async (req, res) => {
    const { id, reqId, reqStts } = req.params

    await User.findOneAndUpdate(
        { _id: id },
        { $set: { "requests.$[elem].reqStatus": reqStts } },
        { arrayFilters: [{ "elem._id": reqId }] }
    )

    const renterEmail = req.query.email
    const renter = await User.find({ email: renterEmail })

    await User.findOneAndUpdate(
        { _id: renter._id },
        { $set: { "bookings.$[elem].bookingStatus": reqStts } },
        { arrayFilters: [{ "elem._id": reqId }] }
    )

    reqStts === 'Approved' ? req.flash('success', `Successfully Approved request`) : req.flash('error', 'Successfully Declined the  Request!');

    res.redirect(`/${id}/renters/Pending`)
}


