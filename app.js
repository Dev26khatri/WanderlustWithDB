//Import all important library
const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const dotenv = require("dotenv");
const ExpressError = require("./utils/ExpressError.js");
const RouterListings = require("./routes/listing.js");
const RouterReview = require("./routes/review.js");
const flash = require("connect-flash");
//Related to Authenition Useing passport library
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const user = require("./routes/user.js");

//Public Folder Join to The main File
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
//When We Use .env File to Protect Your Links and Passwords
dotenv.config();
//Cookies Creation

//Create Response in to JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Method Ovverride Method
app.use(methodOverride("_method"));

//MonogDB Connection
const MONGO_URL = process.env.MONGO_URL;
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("Connected with DB Succsfully"))
  .catch((err) => console.log(err));

//This is the Session options
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.get("/", (req, res) => {
  res.send("You At The Home route");
});

//Create Session For The Browser
app.use(session(sessionOptions));
app.use(flash());
//Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//demo User
// app.get("/demonuser", async (req, res) => {
//   let newUser = new User({
//     email: "lalu@gmail.com",
//     username: "dadu",
//   });
//   let registerUser = await User.register(newUser, "HelloWorld");
//   res.send(registerUser);
// });

app.use("/", user);

//This the Listing Routes
app.use("/listings", RouterListings);

//Reviews Route
app.use("/listings/:id/reviews", RouterReview);

//If you Approch the UnDefined Route then this route will triggerd
app.get("/:any", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//Any Route Have an Error So they Call to ErrorHandling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error", { err });
  // next();
  // res.status(statusCode).send(message);
});

app.listen(8000, () => {
  console.log(`Your Server Runing At http://localhost:${8000}/listings`);
});
