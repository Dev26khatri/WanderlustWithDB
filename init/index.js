const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
async function Main() {
  await mongoose.connect(MONGO_URL);
}
Main()
  .then(() => console.log("Connected with DB Succsfully"))
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initdata.data);
  console.log("data was Initalized");
};
initDB();
