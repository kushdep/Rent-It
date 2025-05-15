const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync");
const RentLoc = require("../models/rentloc");
const { isLoggedIn, validateRentalLocation, isAuthor } = require('../middleware')
const rentLocController = require('../controllers/rentloc')

router.route('/')
  .get(catchAsync(rentLocController.index))
  .post(isLoggedIn,
    validateRentalLocation,
    catchAsync(rentLocController.createRentalLoc)
  );

router.get("/new", isLoggedIn, rentLocController.renderNewForm);

router.route('/:id')
  .get(
    catchAsync(rentLocController.showRentalLoc))
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(rentLocController.deleteRentalLoc)
  )
  .put(
    isLoggedIn,
    validateRentalLocation,
    catchAsync(rentLocController.updateRenatlLoc));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(rentLocController.editRentalLoc));

module.exports = router