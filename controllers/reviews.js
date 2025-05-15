const Review = require("../models/reviews");
const RentLoc = require("../models/rentloc");

module.exports.createReview = async (req, res) => {
    const rentloc = await RentLoc.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    rentloc.reviews.push(review);
    await review.save();
    await rentloc.save();
    req.flash('success', 'Successfully created a new review')
    res.redirect(`/rentloc/${rentloc._id}`);
}


module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await RentLoc.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted review')
    res.redirect(`/rentloc/${id}`);
}


