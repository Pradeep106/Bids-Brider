const mongoose = require("mongoose");

const bidSchema = mongoose.Schema({
    numberOfbids:{
    type: [{
        bidder:{
            type:String,
        },
        bid: Number,
        time: Date
    }],
    required: true,
  },


})

  module.exports = mongoose.model("Bids", bidSchema);