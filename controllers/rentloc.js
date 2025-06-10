const mongoose = require('mongoose')
const RentLoc = require("../models/rentloc");
const User = require('../models/user')
const Utils = require('../utils/utilities')


module.exports.index = async (req, res) => {
  const { id } = req.params
  const allRentLoc = await RentLoc.find().populate("author")
  const rentLoc = allRentLoc.filter((e) => e.author._id.toString() !== id)
  res.render("rentloc/index", { rentLoc });
}

module.exports.renderNewForm = (req, res) => {
  res.render("rentloc/new");
}

module.exports.createRentalLoc = async (req, res) => {
  const newData = new RentLoc(req.body.rentloc);
  newData.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
  newData.author = req.user._id
  await newData.save();
  req.flash('success', 'Successfully made a new rental location')
  res.redirect(`rentloc/${newData._id}`);
}

module.exports.showRentalLoc = async (req, res) => {
  const { id, userId = null } = req.params;
  const rentPlace = await RentLoc.findById({ _id: id }).populate({
    path: "reviews",
    populate: { path: 'author' }
  }).populate('author')
  if (!rentPlace) {
    req.flash('error', "Cannot Get Rental Location")
    return res.redirect('/rentloc')
  }
  const bookedDates = rentPlace.bookedDates
  res.render("rentloc/show", { rentPlace, userId, bookedDates });
}

module.exports.editRentalLoc = async (req, res) => {
  const { id } = req.params;
  const rentloc = await RentLoc.findById(id);
  if (!rentloc) {
    req.flash('error', "Cannot Get Rental Location")
    return res.redirect('/rentloc')
  }
  res.render("rentloc/edit", { rentloc });
}

module.exports.updateRenatlLoc = async (req, res) => {
  const { id } = req.params;
  const updatedData = await RentLoc.findByIdAndUpdate(
    id,
    { ...req.body }.rentloc,
    { new: true }
  );
  req.flash('success', "Successfully updated location")
  res.redirect(`/rentloc/${updatedData._id}`);
}

module.exports.deleteRentalLoc = async (req, res) => {
  const { id } = req.params;
  await RentLoc.findByIdAndDelete(id);
  req.flash('success', 'Successfully Deleted rental location')
  res.redirect("/rentloc");
}


module.exports.showMyLoc = async (req, res) => {
  const { id } = req.params
  const allRentPlace = await RentLoc.find().populate("author")
  const rentLoc = await RentLoc.find({ author: { _id: id } })
  res.render('rentloc/index', { rentLoc })
}

module.exports.rentItForm = async (req, res) => {
  const { locId, userId } = req.params
  const rentPlace = await RentLoc.findById(locId).populate("author")
  const bookingDates = Utils.getDates()
  const bookedDates = rentPlace.bookedDates
  res.render('rentloc/show', { rentPlace, userId, bookingDates, bookedDates })
}

module.exports.reqToRent = async (req, res) => {
  const { locId, userId } = req.params
  const formData = req.body
  console.log(formData)
  const rentloc = await RentLoc.findById(locId);

  const approverId = rentloc.author
  const approver = await User.findById(approverId)
  const renter = await User.findById(userId)

  const totalNights = formData.totalRent / rentloc.price
  const newId = new mongoose.Types.ObjectId();

  approver.requests.push({
    _id: newId,
    location: locId,
    reqBy: {
      username: formData.username,
      email: formData.email,
      idProof: formData.idProof
    },
    reqForDates: {
      start: formData.rentDates.slice(0,10),
      end: formData.rentDates.slice(14,24)
    },
    rentDetails: {
      totalNights: totalNights,
      totalRent: formData.totalRent,
    },
    reqStatus: 'Pending'
  })
  await approver.save()

  renter.bookings.push({
    _id: newId,
    locDetails: {
      title: rentloc.title,
      images: [...rentloc.images],
      price: rentloc.price,
      description: rentloc.description,
      location: rentloc.location
    },
    locOwnerDetails: {
      username: approver.username,
      email: approver.email
    },
    bookingDates: {
      start: formData.rentDates.slice(0,10),
      end: formData.rentDates.slice(14,24)
    },
    bookingStatus: 'Pending',
    rentDetails: {
      totalNights: totalNights,
      totalRent: formData.totalRent
    }
  })
  await renter.save()

  req.flash('success', `Successfully made a Request to ${approver.username}`)
  res.redirect(`/rentloc/${locId}`)
}

