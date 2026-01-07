const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

const ValidateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      400,
      error.details.map((e) => e.message)
    );
  } else {
    next();
  }
};
router.post(
  "/",
  isLoggedIn,
  ValidateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${listing._id}`);
    // console.log(req.body.review);
    // console.log("New Review Saved");
    // res.send("New Review Saved");
  })
);
//Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
