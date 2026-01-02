const express = require("express");
const app = express();
const path = require("path");
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
const session = require("express-session");
const flash = require("connect-flash");

const sesstionOption = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: false,
};
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session(sesstionOption));
app.use(flash());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});
app.get("/register", (req, res) => {
  let { name = "Anonmouys" } = req.query;
  req.session.name = name;
  if (name == "Anonmouys") {
    req.flash("error", "User not registor");
  } else {
    req.flash("success", "User successfully created!");
  }
  res.redirect("/hello");
});
app.get("/hello", (req, res) => {
  res.render("page.ejs", { name: req.session.name });
});

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`You send the request ${req.session.count} times`);
// });

// app.get("/test", (req, res) => {
//   res.send("Request Goes Succsefful");
// });

app.listen(3000, (req, res) => {
  console.log(`Your Project Run At = http://localhost:3000 `);
});
