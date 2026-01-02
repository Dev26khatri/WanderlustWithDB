const express = require("express");
const router = express.Router();    
//Routes For Posts
//Index - posts
router.get("/", (req, res) => {
  res.send("GET For posts");
});
//Show - posts Within Id
router.get("/:id", (req, res) => {
  res.send("GET For posts");
});
//POST - posts
router.post("/", (req, res) => {
  res.send("GET For posts");
});
//DELETE - posts
router.delete("/:id", (req, res) => {
  res.send("GET For posts");
});

module.exports = router;
