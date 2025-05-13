const express = require('express')
const router = express.Router({mergeParams:true})
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/reviews");
const RentLoc = require("../models/rentloc");
const { reviewSchema } = require("../schemas");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error);
        const msg = error.details.map((e) => e.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.post(
    "/",
    validateReview,
    catchAsync(async (req, res) => {
        const rentloc = await RentLoc.findById(req.params.id);
        const review = new Review(req.body.review);
        rentloc.reviews.push(review);
        await review.save();
        await rentloc.save();
        req.flash('success','Successfully created a new review')
        res.redirect(`/rentloc/${rentloc._id}`);
    })
);

router.delete(
    "/:reviewId",
    catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await RentLoc.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success','Successfully Deleted review')
        res.redirect(`/rentloc/${id}`);
    })
);

module.exports = router;





