const router = require("express").Router();
const {
  createProduct,
  getAllProdcut,
  getOneProduct,
  updateProduct,
  deleteProduct,
  updateAuction,
} = require("../controller/Product");
const { auth } = require("../middleware/auth");
const multer = require("../middleware/multer");
router.route("/create").post(multer, auth, createProduct);
router.route("/getproduct").get(getAllProdcut);
router
  .route("/getproduct/:id")
  .get(getOneProduct)
  .put(updateProduct)
  .delete(deleteProduct)
  .post(auth, updateAuction);

module.exports = router;
