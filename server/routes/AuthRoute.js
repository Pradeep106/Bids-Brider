const router = require("express").Router();
const { auth } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getAllUser,
  getUser,
} = require("../controller/Auth");

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user").get(getAllUser);
router.route("/user/profile").get(auth, getUser);

module.exports = router;
