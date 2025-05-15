const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync");
const RentLoc = require("../models/rentloc");
const { isLoggedIn, validateRentalLocation, isAuthor } = require('../middleware')
const rentLocController = require('../controllers/rentloc')



router.get("/", catchAsync(rentLocController.index));

router.get("/new", isLoggedIn, rentLocController.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  validateRentalLocation,
  catchAsync(rentLocController.createRentalLoc)
);

router.get(
  "/:id",
  catchAsync(rentLocController.showRentalLoc)
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(rentLocController.editRentalLoc));


router.put(
  "/:id",
  isLoggedIn,
  validateRentalLocation,
  catchAsync(rentLocController.updateRenatlLoc));

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(rentLocController.deleteRentalLoc)
);


module.exports = router