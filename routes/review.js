const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const { reviewSchema } = require("../schema.js");
const { isLoggedIn, IsAuthor, saveRedirectUrl } = require("../middleware.js");
const { ValidateReview } = require("../middleware.js");

router.post(
  "/",
  isLoggedIn,
  ValidateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
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
  IsAuthor,
  // saveRedirectUrl,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    // let redirection = redirectUrl || `/listings/${id}`;
    // res.redirect(redirection);

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
