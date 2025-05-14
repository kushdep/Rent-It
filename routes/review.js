const express = require('express')
const router = express.Router({ mergeParams: true })
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/reviews");
const RentLoc = require("../models/rentloc");
const { reviewSchema } = require("../schemas");
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware')

router.post(
    "/",
    isLoggedIn,
    validateReview,
    catchAsync(async (req, res) => {
        const rentloc = await RentLoc.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author=req.user._id
        rentloc.reviews.push(review);
        await review.save();
        await rentloc.save();
        req.flash('success', 'Successfully created a new review')
        res.redirect(`/rentloc/${rentloc._id}`);
    })
);

router.delete(
    "/:reviewId",
    isReviewAuthor,
    catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await RentLoc.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfully Deleted review')
        res.redirect(`/rentloc/${id}`);
    })
);

module.exports = router;





