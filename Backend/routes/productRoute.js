const express = require("express");
const { auth, allowedTo } = require("../controllers/authController");
const {
  createProductValidator,
  getProductByIdValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const {
  getAllProducts,
  createProduct,
  setPriceFromCategory,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const upload = require("../middleware/uploadImage");
const normalizeFormData = require("../middleware/normalizeFormData");
const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    auth,
    allowedTo("admin"),
    upload.fields([
      { name: "imageCover", maxCount: 1 },
      { name: "images", maxCount: 5 },
    ]),
    setPriceFromCategory,
    normalizeFormData,

    createProductValidator,
    createProduct,
  );

router
  .route("/:id")
  .get(getProductByIdValidator, getProductById)
  .patch(
    auth,
    allowedTo("admin"),
    upload.fields([
      { name: "imageCover", maxCount: 1 },
      { name: "images", maxCount: 5 },
    ]),
    normalizeFormData,
    updateProductValidator,
    updateProduct,
  )
  .delete(auth, allowedTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
