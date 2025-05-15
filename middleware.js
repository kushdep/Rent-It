const ExpressError = require('./utils/ExpressError')
const RentLoc = require('./models/rentloc')
const Review = require('./models/reviews')
const { rentLocationSchema, reviewSchema } = require('./schemas')

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    console.log("return to" + req.session.returnTo)
    console.log("original URl" + req.originalUrl)
    req.flash('error', 'you must sign in')
    return res.redirect('/login')
  }
  next();
}

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}


module.exports.validateRentalLocation = (req, res, next) => {
  const { error } = rentLocationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const rentloc = await RentLoc.findById(id)
  if (!rentloc.author.equals(req.user._id)) {
    req.flash('error', "You are not allowed to do this")
    return res.redirect(`/rentloc/${id}`)
  }
  next();
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId)
  if (!review.author.equals(req.user._id)) {
    req.flash('error', "You are not allowed to do this")
    return res.redirect(`/rentloc/${id}`)
  }
  next();
}


