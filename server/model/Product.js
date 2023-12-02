const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  detail: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    required: true
  },
  startingBid: {
    type: Number,
    required:true,
  },
  image: {
    type: String,
    required: true,
  },
  targetDate:{
    type:Date,
    required:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Bids",

  }
});



module.exports = mongoose.model("Product", productSchema);
