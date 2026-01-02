const express = require("express");
const router = express.Router();
//Index - User
router.get("/", (req, res) => {
  res.send("GET For Users");
});
//Show - User Within Id
router.get("/:id", (req, res) => {
  res.send("GET For Users");
});
//POST - Users
router.post("/", (req, res) => {
  res.send("GET For Users");
});
//DELETE - Users
router.delete("/:id", (req, res) => {
  res.send("GET For Users");
});

module.exports = router;
