const express = require('express')
const router = express.Router()
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const RentLoc = require("../models/rentloc");
const { rentLocationSchema } = require("../schemas");

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

router.get("/new", (req, res) => {
  res.render("rentloc/new");
});

router.post(
  "/",
  validateRentalLocation,
  catchAsync(async (req, res) => {
    const newData = new RentLoc(req.body.rentloc);
    await newData.save();
    console.log(newData._id);
    res.redirect(`rentloc/${newData._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rentPlace = await RentLoc.findById({ _id: id }).populate("reviews");
    console.log(rentPlace);
    res.render("rentloc/show", { rentPlace });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const loc = await RentLoc.findById(id);
    res.render("rentloc/edit", { loc });
  }));


router.put(
  "/:id",
  validateRentalLocation,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = await RentLoc.findByIdAndUpdate(
      id,
      { ...req.body }.rentloc,
      { new: true }
    );
    console.log(updatedData);
    res.redirect(`/rentloc/${updatedData._id}`);
  }));

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await RentLoc.findByIdAndDelete(id);
    res.redirect("/rentloc");
  })
);


module.exports = router