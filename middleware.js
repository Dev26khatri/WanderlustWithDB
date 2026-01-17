const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    // console.log(req.session.redirectUrl);
    // console.log(req.session.redirectUrl);

    req.flash("error", "You must be logged In");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  // console.log(req);
  // console.log(req.session.redirectUrl);
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl; // cleanup
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listings");
    return res.redirect(`/listings/${req.params.id}`);
  }
  next();
};
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details.map((e) => e.message).join(","));
  } else {
    next();
  }
};
module.exports.ValidateReview = (req, res, next) => {
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
module.exports.IsAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Author of this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
