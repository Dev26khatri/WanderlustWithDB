const monggoose = require("mongoose");
const Schema = monggoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://media.istockphoto.com/id/2170456340/photo/neighborhood-new-homes-sunset-north-carolina-wide-angle.webp?s=1024x1024&w=is&k=20&c=TN0u-SDrWwJZY9TReSbYRgEVZhzi-_LCvrw5uFkbYhI=",
    set: (v) =>
      v === ""
        ? "https://media.istockphoto.com/id/2170456340/photo/neighborhood-new-homes-sunset-north-carolina-wide-angle.webp?s=1024x1024&w=is&k=20&c=TN0u-SDrWwJZY9TReSbYRgEVZhzi-_LCvrw5uFkbYhI="
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = monggoose.model("Listing", ListingSchema);
module.exports = Listing;
