//Import all important library
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const dotenv = require("dotenv");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js");
//Library configurtions
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
dotenv.config();

//Use for the Middlwear functions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);

const MONGO_URL = process.env.MONGO_URL;
async function Main() {
  await mongoose.connect(MONGO_URL);
}
Main()
  .then(() => console.log("Connected with DB Succsfully"))
  .catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.send("You At The Home route");
});

const ValidateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    // const errMsg = error.details.map((e) => e.message.join(","));
    // console.log(error.details[0].message);
    // const errMsg = error.details.map(((e) => e.message).join(","));
    // console.log(errMsg);
    throw new ExpressError(400, error.details.map((e) => e.message).join(","));
  } else {
    next();
  }
};

//"New" Route For Create NEw Listings
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Index Route Which is Showing hole Lists
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//Show routes which One list and render showing tamplete
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id);
    res.render("listings/show.ejs", { listings });
  })
);

//Add listings route
app.post(
  "/listings",
  ValidateListing,
  wrapAsync(async (req, res) => {
    // console.log(req.body.listing);
    const Newlisting = new Listing(req.body.listing);

    await Newlisting.save();
    res.redirect("/listings");
  })
);

//Update Routes
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/update.ejs", { listing });
  })
);
app.put(
  "/listings/:id",
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
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const DeleteDocuments = await Listing.findByIdAndDelete(req.params.id, {
      new: true,
    });
    console.log(DeleteDocuments);
    res.redirect("/listings");
  })
);

//Reviews Route
//POST Route
app.post("/listings/:id/reviews", async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`)
  // console.log(req.body.review);
  // console.log("New Review Saved");
  // res.send("New Review Saved");
});

app.get("/:any", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error", { err });
  // res.status(statusCode).send(message);
});

app.listen(8000, () => {
  console.log(`Your Server Runing At http://localhost:${8000}/listings`);
});
