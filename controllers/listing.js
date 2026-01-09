const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.renderListing = async (req, res) => {
  let { id } = req.params;
  let listings = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listings) {
    req.flash("error", "The listing you requested does not exist");
    return res.redirect("/listings");
    // throw new ExpressError(404, "Listing Not Found");
  }
  // console.log(listings);
  res.render("listings/show.ejs", { listings });
};
module.exports.createListing = async (req, res) => {
  // console.log(req.body.listing);
  const Newlisting = new Listing(req.body.listing);
  Newlisting.owner = req.user._id;
  await Newlisting.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The listing you requested does not exist");
    return res.redirect("/listings");
    // throw new ExpressError(404, "Listing Not Found");
  }
  res.render("listings/update.ejs", { listing });
};
module.exports.updatingListing = async (req, res) => {
  if (!req.body) {
    throw new ExpressError(400, "Send Valid Data for Listing");
  }

  const UpdateLising = await Listing.findByIdAndUpdate(
    req.params.id,
    { ...req.body.listing },
    { new: true }
  );
  req.flash("success", "Listing Was Updated!");

  res.redirect(`/listings/${req.params.id}`);
};
module.exports.destroyListing = async (req, res) => {
  const DeleteDocuments = await Listing.findByIdAndDelete(req.params.id, {
    new: true,
  });
  console.log(DeleteDocuments);
  req.flash("success", "Listing Was Deleted!");
  res.redirect("/listings");
};
