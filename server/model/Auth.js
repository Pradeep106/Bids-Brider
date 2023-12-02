const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    userName:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        required:true,
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    }],
    bid:[{
        type:mongoose.Schema.Types.ObjectId,
    ref:"Bid",
    }],
})


module.exports = mongoose.model("Auth",userSchema);