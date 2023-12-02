const Razorpay = require("razorpay");
require("dotenv").config();
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.razorPay = catchAsyncError(async (req, res, next) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const options = {
    amount: 50000, /// amount in smallest currency unit
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };
  const order = await instance.orders.create(options);

  if (!order) {
    return next(new ErrorHandler("Some error occured, 500"));
  }
  res.json(order);
});
