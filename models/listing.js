const monggoose = require("mongoose");
const Schema = monggoose.Schema;
const ImageChoices = [
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://media.istockphoto.com/id/146765403/photo/a-luxurious-florida-beach-hotel-during-sunrise.jpg?s=612x612&w=0&k=20&c=pxw9Q78KbvqV6_pS_C-v_m6S_WQjKWLBSdqgRtqMUUg=",
  "https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=",
];
const RandomChoice =
  ImageChoices[Math.floor(Math.random() * ImageChoices.length)];

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    // default:
    //   "https://media.istockphoto.com/id/2170456340/photo/neighborhood-new-homes-sunset-north-carolina-wide-angle.webp?s=1024x1024&w=is&k=20&c=TN0u-SDrWwJZY9TReSbYRgEVZhzi-_LCvrw5uFkbYhI=",
    set: (v) =>
      v === ""
        ? "https://media.istockphoto.com/id/2170456340/photo/neighborhood-new-homes-sunset-north-carolina-wide-angle.webp?s=1024x1024&w=is&k=20&c=TN0u-SDrWwJZY9TReSbYRgEVZhzi-_LCvrw5uFkbYhI="
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Listing = monggoose.model("Listing", ListingSchema);
module.exports = Listing;
