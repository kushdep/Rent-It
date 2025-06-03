const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateRentalLocation, isAuthor } = require('../middleware')
const rentLocController = require('../controllers/rentloc')
const { storage } = require('../cloudinary')
const multer = require("multer");
const upload = multer({ storage })

router.route('/')
  .get(catchAsync(rentLocController.index))
  .post(isLoggedIn,
    validateRentalLocation,
    upload.array('image'),
    catchAsync(rentLocController.createRentalLoc)
  );

router.get('/user/:id',isLoggedIn,rentLocController.index)

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

  //in this it containing user id
router.get('/:id/my-locations',
  isLoggedIn,
  catchAsync(rentLocController.showMyLoc)
)

router.route('/:locId/rent-it/:userId')
.get(
  isLoggedIn,
  catchAsync(rentLocController.rentItForm)
)
.post(
  isLoggedIn,
  catchAsync(rentLocController.reqToRent))

module.exports = router