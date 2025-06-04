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
  res.render("rentloc/show", { rentPlace, userId });
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
  console.log(allRentPlace)
  const rentLoc = await RentLoc.find({ author: { _id: id } })
  console.log("My loc " + rentLoc)
  res.render('rentloc/index', { rentLoc })
}

module.exports.rentItForm = async (req, res) => {
  const { locId, userId } = req.params
  const rentPlace = await RentLoc.findById(locId).populate("author")
  const bookingDates = Utils.getDates()
  res.render('rentloc/show', { rentPlace, userId,bookingDates })
}

module.exports.reqToRent = async (req, res) => {
  const { locId, userId } = req.params
  const { From, To, idProof } = req.body
  const rentloc = await RentLoc.findById(locId);
  const approverId = rentloc.author
  const approver = await User.findById(approverId)
  const renter = await User.findById(userId)
  approver.requests.push({
    location: locId,
    rentedBy: userId,
    idProof: idProof,
    From: From,
    To: To
  })
  await approver.save()
  renter.approvals.push({
    location: locId,
    approvalBy: approverId
  })
  await renter.save()
  req.flash('success', `Successfully made a Request to ${approver.username}`)
  res.redirect(`/rentloc/${locId}`)
}

