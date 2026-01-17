const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// const ExpressError = require("../utils/ExpressError.js");
// const Listing = require("../models/listing");
// const { listingSchema, reviewSchema } = require("../schema.js");

//Index Route Which is Showing hole Lists
// router.get("/", wrapAsync(listingControllers.index));
//Create Form Rendering
//Rendering Specific Listing

//Always Write At top becuase
//If you wrote new route after the any id route so express consider new route as a id

router.route("/new").get(isLoggedIn, listingControllers.renderNewForm);
router
  .route("/:id")
  //Rendring Specific Listings
  .get(wrapAsync(listingControllers.renderListing))
  //Update PUT Routes for the Listings
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    isOwner,
    validateListing,
    wrapAsync(listingControllers.updatingListing)
  )
  //Destroy means delete Route for the listings
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing));

router
  .route("/")
  //All listings
  .get(wrapAsync(listingControllers.index))
  //Post Method for the CreateListings
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.createListing)
  );
// .post(upload.single("listing[image]"), (req, res) => {
//   res.send(req.file.path);
// });
//Render Updating Form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.renderEditForm)
);
// router.get("/:id", wrapAsync(listingControllers.renderListing));
//POST For Create Listings
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingControllers.createListing)
// );

// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingControllers.updatingListing)
// );

//Delete Route To delete data
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingControllers.destroyListing)
// );

module.exports = router;
