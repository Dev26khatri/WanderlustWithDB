//Import all important library
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const dotenv = require("dotenv");
const ExpressError = require("./utils/ExpressError.js");
const RouterListings = require("./routes/listing.js");
const RouterReview = require("./routes/review.js");
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
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("Connected with DB Succsfully"))
  .catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.send("You At The Home route");
});

//"New" Route For Create NEw Listings

app.use("/listings", RouterListings);
//Reviews Route
//POST Route
app.use("/listings/:id/reviews", RouterReview);

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
