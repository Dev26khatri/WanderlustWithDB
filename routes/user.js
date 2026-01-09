const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userControllers = require("../controllers/user");

router
  .route("/singup")
  .get(userControllers.renderSingupForm)
  .post(wrapAsync(userControllers.singup));

router
  .route("/login")
  .get(userControllers.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userControllers.login
  );

router.get("/logout", userControllers.logout);
// router.get("/singup", userControllers.renderSingupForm);
// router.post("/singup", wrapAsync(userControllers.singup));
// router.get("/login", (req, res) => {
//   res.render("users/login.ejs");
// });
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userControllers.login
// );
module.exports = router;
