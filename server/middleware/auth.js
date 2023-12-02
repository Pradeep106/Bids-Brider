const jwt = require("jsonwebtoken");
const User = require("../model/Auth");
require("dotenv").config();
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");


exports.auth = catchAsyncError( async(req,res,next)=>{
    
    //Extracting token which is saved to the user local storege while login
        const token =  req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            return next(new ErrorHandler("Token is missing", 401));  

        }

        //Verifiyig the token
        const decode =jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode;

        next();
})

