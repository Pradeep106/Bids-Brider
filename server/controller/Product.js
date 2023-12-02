const Product = require("../model/Product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const Bid = require("../model/Bids");
const User = require("../model/Auth");

exports.createProduct = catchAsyncError(async (req, res, next) => {
  const { title, description, startingBid,targetDate } = req.body;
  const result = req.file.path;

  if (!title || !description || !startingBid || !result ||!targetDate) {
    return next(new ErrorHandler("All fields required", 404));
  }

  const fileName = req.file.originalname.split(".")[0];

  const prodcutsImage = await cloudinary.uploader.upload(result, {
    resource_type: "image",
    public_id: `ProductsImages/${fileName}`,
  });

  const user = req.user;

  // Create a new Bid
  const bid = await Bid.create({
    bid: [],
  });

  // Create a new Product
  const product = await Product.create({
    title,
    description,
    startingBid,
    image: prodcutsImage.secure_url,
    targetDate,
    bid: bid._id,
  });

  // Update the user's products array with the newly created product's ID

  const updatedUser = await User.findByIdAndUpdate(
    { _id: user.id },
    {
      $push: {
        products: product._id,
      },
    },
    { new: true }
  );

  // Save the updated user
  // const updatedUser = await user.save();

  return res.status(200).json({
    success: true,
    message: "Product created successfully",
    product,
    updatedUser,
  });
});
//get all

exports.getAllProdcut = catchAsyncError(async (req, res) => {
  const product = await Product.find();

  return res.status(200).json({
    success: true,
    product,
  });
});

//get one

exports.getOneProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("bid");

  const bid = product.bid ? product.bid.numberOfbids : "No bids";



  if (!product) {
    return next(new ErrorHandler("Prodcut not found", 404));
  }
  // const bid = product.bid.numberOfbids;
  res.status(200).json({
    success: true,
    product,
    bid,
  });
});

//update;
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new ErrorHandler("id and data required", 404));
  }

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

//delete
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new ErrorHandler("id and data required", 404));
  }

  const product = await Product.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    product,
  });
});
exports.updateAuction = catchAsyncError(async (req, res, next) => {
  const { bidValue } = req.body;

  if (!req.user || !req.user.email) {
    return next(new ErrorHandler("User not authenticated", 401));
  }
  const userEmail = req.user.email;


  const parts = userEmail.split("@");

  const userName = parts[0];



  const product = await Product.findById(req.params.id, {}).populate("bid");

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const bid = await Bid.findOne(product.bid._id);
  const newBid = {
    bidder: userName,
    bid: bidValue,
    time: new Date(),
  };

  bid.numberOfbids.push(newBid);

  const updatedData = await bid.save();


  res.status(200).json({
    success: true,
    updatedData,
  });
});
