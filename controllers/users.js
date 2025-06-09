const passport = require('passport')
const User = require('../models/user')
const RentLoc = require('../models/rentloc')

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

module.exports.getMyBookingsData = async (req, res) => {
    const { id, reqState } = req.params
    const buttonValues = ['Pending', 'Approved', 'Declined']
    const activeBtn = reqState
    const role = 'my-bookings'

    const user = await User.findById(id)
    const bookLoc = user.bookings.filter(e => e.bookingStatus === reqState)

    res.render('rentloc/bookings', { buttonValues, id, bookLoc, activeBtn, role })
}

module.exports.getRentersData = async (req, res) => {
    const { id, reqState } = req.params
    const buttonValues = ['Pending', 'Approved', 'Declined']
    const activeBtn = reqState
    const role = 'renters'


    const user = await User.findById(id).populate('requests.location')
    const reqLoc = user.requests.filter(e => e.reqStatus === reqState)

    res.render('rentloc/renters', { buttonValues, id, activeBtn, reqLoc, role })
}

module.exports.setReqLocStts = async (req, res) => {
    const { id, reqId, reqStts } = req.params
    const updatedDoc = await User.findOneAndUpdate(
        { _id: id },
        { $set: { "requests.$[elem].reqStatus": reqStts } },
        { arrayFilters: [{ "elem._id": reqId }] },
        { returnNewDocument: true }
    )

    await User.findOneAndUpdate(
        { email: req.query.email },
        { $set: { "bookings.$[elem].bookingStatus": reqStts } },
        { arrayFilters: [{ "elem._id": reqId }] },
        { returnNewDocument: true }
    )

    if (reqStts === 'Approved') {
        const request = updatedDoc.requests.find(e => e._id.toString() === reqId);
        console.log("request "+request)
        const locId = request ? request.location : null;
        console.log("locId "+locId)
        const loc = await RentLoc.findById(locId);
        console.log("loc "+loc)
        
        const from = new Date(request.reqForDates.start)
        console.log("from "+from)
        let fromEpoch = from.getTime()
        console.log("fromEpoch "+fromEpoch)
        const nights = request.rentDetails.totalNights - 1
        console.log("nights "+nights)
        
        loc.bookedDates.push(fromEpoch.toISOString().split(0, 10))
        await loc.save();
        console.log("bookingdates "+loc.bookedDates)
        
        for (let i = 0; i < nights; i++) {
            fromEpoch += 24 * 60 * 60 * 1000
            console.log("fromEpoch i "+fromEpoch)
            let date = new Date(fromEpoch)
            console.log("date i "+date+i)
            loc.bookedDates.push(date.toISOString().split(0, 10))
        }
        
        await loc.save();
        console.log("bookingdates "+loc.bookedDates)
    }

    reqStts === 'Approved' ? req.flash('success', `Successfully Approved request`) : req.flash('error', 'Successfully Declined the  Request!');
    res.redirect(`/${id}/renters/Pending`)
}

module.exports.delReqLoc = async (req, res) => {
    const { id, bookId } = req.params

    const data = await User.findByIdAndUpdate(
        id,
        { $pull: { bookings: { _id: bookId } } }
    )


    const value = await User.findOneAndUpdate(
        { email: req.query.email },
        { $pull: { requests: { _id: bookId } } }
    )


    req.flash('error', `Successfully Deleted request`)
    res.redirect(`/${id}/my-bookings/Pending`)
}
