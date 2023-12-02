const router = require("express").Router();
const {razorPay} = require("../controller/Payment");


router.post("/",razorPay);

module.exports = router;
