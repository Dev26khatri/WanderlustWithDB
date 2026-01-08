const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
// const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

router.get("/new", isLoggedIn, (req, res) => {
  // if (!req.user) {
  //   console.log("Your User was Undifind");
  // } else {
  //   console.log(req.user);
  //   console.log(req.isAuthenticated());
  // }
  // if (!req.isAuthenticated()) {
  //   req.flash("error", "You must be logged in to create listings");
  //   return res.redirect("/login");
  // }
  res.render("listings/new.ejs");
});

//Index Route Which is Showing hole Lists
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//Show routes which One list and render showing tamplete
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
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
  })
);

//Add listings route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    // console.log(req.body.listing);
    const Newlisting = new Listing(req.body.listing);
    Newlisting.owner = req.user._id;
    await Newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

//Update Routes
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "The listing you requested does not exist");
      return res.redirect("/listings");
      // throw new ExpressError(404, "Listing Not Found");
    }
    res.render("listings/update.ejs", { listing });
  })
);
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
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
  })
);

//Delete Route To delete data
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const DeleteDocuments = await Listing.findByIdAndDelete(req.params.id, {
      new: true,
    });
    console.log(DeleteDocuments);
    req.flash("success", "Listing Was Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
