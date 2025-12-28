const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schema.js");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details.map((e) => e.message).join(","));
  } else {
    next();
  }
};

router.get("/new", (req, res) => {
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
    let listings = await Listing.findById(id).populate("reviews");
    if (!listings) {
      throw new ExpressError(404, "Listing Not Found");
    }
    res.render("listings/show.ejs", { listings });
  })
);

//Add listings route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    // console.log(req.body.listing);
    const Newlisting = new Listing(req.body.listing);

    await Newlisting.save();
    res.redirect("/listings");
  })
);

//Update Routes
router.get(
  "/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/update.ejs", { listing });
  })
);
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    if (!req.body) {
      throw new ExpressError(400, "Send Valid Data for Listing");
    }
    const UpdateLising = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body.listing },
      { new: true }
    );

    res.redirect(`/listings/${req.params.id}`);
  })
);

//Delete Route To delete data
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const DeleteDocuments = await Listing.findByIdAndDelete(req.params.id, {
      new: true,
    });
    console.log(DeleteDocuments);
    res.redirect("/listings");
  })
);

module.exports = router;
