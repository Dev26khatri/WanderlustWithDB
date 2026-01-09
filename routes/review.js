const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/review.js");
const { isLoggedIn, IsAuthor, saveRedirectUrl } = require("../middleware.js");
const { ValidateReview } = require("../middleware.js");

router.post(
  "/",
  isLoggedIn,
  ValidateReview,
  wrapAsync(reviewController.createReview)
);
//Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  IsAuthor,
  // saveRedirectUrl,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
