const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  //POST method for the Review in specific listing
  let listing = await Listing.findById(req.params.id);
  //Requesting Body for your review fields
  let newReview = new Review(req.body.review);
  //Asign ID to the author
  newReview.author = req.user._id;
  // console.log(newReview);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created!");

  res.redirect(`/listings/${listing._id}`);
  // console.log(req.body.review);
  // console.log("New Review Saved");
  // res.send("New Review Saved");
};
module.exports.destroyReview = async (req, res) => {
  //delete An review
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  // let redirection = redirectUrl || `/listings/${id}`;
  // res.redirect(redirection);

  res.redirect(`/listings/${id}`);
};
