const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const RentlocSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String
    }
  ],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  bookingDetails: [
    {
      bookedForDates: {
        start: { type: Date },
        end: { type: Date }
      },
      bookedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      rent: Number
    }
  ]
});

RentlocSchema.post("findOneAndDelete", async function (doc) {
  if (doc.reviews.length) {
    const res = await Review.deleteMany({ _id: { $in: doc.reviews } });
    console.log(res);
  }
});

const RentLoc = mongoose.model("RentLoc", RentlocSchema);

module.exports = RentLoc;
