const express = require('express')
const router = express.Router()
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const RentLoc = require("../models/rentloc");
const { rentLocationSchema } = require("../schemas");
const { isLoggedIn } = require('../middleware')

const validateRentalLocation = (req, res, next) => {
  const { error } = rentLocationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


router.get(
  "/",
  catchAsync(async (req, res) => {
    const rentLoc = await RentLoc.find({});
    res.render("rentloc/index", { rentLoc });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("rentloc/new");
});

router.post(
  "/",
  isLoggedIn,
  validateRentalLocation,
  catchAsync(async (req, res) => {
    const newData = new RentLoc(req.body.rentloc);
    await newData.save();
    req.flash('success', 'Successfully made a new rental location')
    res.redirect(`rentloc/${newData._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rentPlace = await RentLoc.findById({ _id: id }).populate("reviews");
    if (!rentPlace) {
      req.flash('error', "Cannot Get Rental Location")
      return res.redirect('/rentloc')
    }
    res.render("rentloc/show", { rentPlace });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const loc = await RentLoc.findById(id);
    if (!loc) {
      req.flash('error', "Cannot Get Rental Location")
      return res.redirect('/rentloc')
    }
    res.render("rentloc/edit", { loc });
  }));


router.put(
  "/:id",
  isLoggedIn,
  validateRentalLocation,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = await RentLoc.findByIdAndUpdate(
      id,
      { ...req.body }.rentloc,
      { new: true }
    );
    req.flash('success', "Successfully updated location")
    res.redirect(`/rentloc/${updatedData._id}`);
  }));

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await RentLoc.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted rental location')
    res.redirect("/rentloc");
  })
);


module.exports = router