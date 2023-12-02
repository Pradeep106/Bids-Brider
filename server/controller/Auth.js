const User = require("../model/Auth");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    return next(new ErrorHandler("All fields required", 404));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.findOne({ email });
  if (!user) {
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });
    return res.status(200).json({
      success: true,
      message: "Signup Successfully",
      newUser,
    });
  }
  return next(new ErrorHandler("User already exists", 404));
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("All fields required", 404));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Generate Jwt token and compare password
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Save token to user document in database
    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User login successfully",
      token,
      user,
    });
  } else {
    return next(new ErrorHandler("Invalid password", 401));
  }
});

exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const user = await User.find();

  return res.status(200).json({
    success: true,
    user,
  });
});

exports.getUser = catchAsyncError(async (req, res, next) => {

  const user = await User.findById(req.user.id).populate("products");

  if (!user) {
    return next(new ErrorHandler("Prodcut not found", 404));
  }

  return res.status(200).json({
    success: true,
    user,
  });
});
