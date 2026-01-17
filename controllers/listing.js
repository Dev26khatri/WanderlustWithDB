const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  //Controller for all listings
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderListing = async (req, res) => {
  //For the Specific Lists
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

module.exports.renderNewForm = (req, res) => {
  //For Remdering New Form
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  //Post Method for create listing
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, filename);
  // console.log(req.body.listing);
  const Newlisting = new Listing(req.body.listing);
  Newlisting.owner = req.user._id;
  Newlisting.image = { url, filename };
  await Newlisting.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res, next) => {
  //For Render Editing Route
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The listing you requested does not exist");
    return res.redirect("/listings");
    // throw new ExpressError(404, "Listing Not Found");
  }
  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/h_300,w_350");
  res.render("listings/update.ejs", { listing, originalImage });
};

module.exports.updatingListing = async (req, res) => {
  //PUT method for the Updating Lists
  if (!req.body) {
    throw new ExpressError(400, "Send Valid Data for Listing");
  }

  const UpdateLising = await Listing.findByIdAndUpdate(
    req.params.id,
    { ...req.body.listing },
    { new: true }
  );
  //saving the uploaded file if that not undefined
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    UpdateLising.image = { url, filename };
  }
  await UpdateLising.save();
  req.flash("success", "Listing Was Updated!");

  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyListing = async (req, res) => {
  //Delete Method to delete a specific list
  const DeleteDocuments = await Listing.findByIdAndDelete(req.params.id, {
    new: true,
  });
  console.log(DeleteDocuments);
  req.flash("success", "Listing Was Deleted!");
  res.redirect("/listings");
};
