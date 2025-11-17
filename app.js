//Import all important library
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const dotenv = require("dotenv");

//Library configurtions
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
dotenv.config();

//Use for the Middlwear functions
app.use(express.urlencoded({ extended: true }));
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

//"New" Route For Create NEw Listings
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Index Route Which is Showing hole Lists
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//Show routes which One list and render showing tamplete
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listings = await Listing.findById(id);
  res.render("listings/show.ejs", { listings });
});

//Add listings route
app.post("/listings", async (req, res) => {
  const Newlisting = new Listing(req.body.listing);
  await Newlisting.save();
  res.redirect("/listings");
});

//Update Routes
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/update.ejs", { listing });
});
app.put("/listings/:id", async (req, res) => {
  const UpdateLising = await Listing.findByIdAndUpdate(
    req.params.id,
    { ...req.body.listing },
    { new: true }
  );

  res.redirect(`/listings/${req.params.id}`);
});

//Delete Route To delete data
app.delete("/listings/:id", async (req, res) => {
  const DeleteDocuments = await Listing.findByIdAndDelete(req.params.id, {
    new: true,
  });
  console.log(DeleteDocuments);
  res.redirect("/listings");
});

app.listen(8000, () => {
  console.log(`Your Server Runing At http://localhost:${8000}/listings`);
});
