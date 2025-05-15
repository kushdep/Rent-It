const RentLoc = require("../models/rentloc");


module.exports.index = async (req, res) => {
  const rentLoc = await RentLoc.find({});
  res.render("rentloc/index", { rentLoc });
}

module.exports.renderNewForm = (req, res) => {
  res.render("rentloc/new");
}

module.exports.createRentalLoc = async (req, res) => {
  const newData = new RentLoc(req.body.rentloc);
  newData.author = req.user._id
  await newData.save();
  req.flash('success', 'Successfully made a new rental location')
  res.redirect(`rentloc/${newData._id}`);
}

module.exports.showRentalLoc = async (req, res) => {
  const { id } = req.params;
  const rentPlace = await RentLoc.findById({ _id: id }).populate({
    path: "reviews",
    populate: { path: 'author' }
  }).populate('author')
  if (!rentPlace) {
    req.flash('error', "Cannot Get Rental Location")
    return res.redirect('/rentloc')
  }
  res.render("rentloc/show", { rentPlace });
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


