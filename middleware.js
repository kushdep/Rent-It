module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        console.log("return to"+req.session.returnTo)
        console.log("original URl"+req.originalUrl)
        req.flash('error', 'you must sign in')
        return res.redirect('/login')
    }
    next();
}

module.exports.storeReturnTo = (req,res,next) =>{
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}