const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  deleteProductFromCart,
  clearCart,
  updateCartItemQuantity,
} = require("../controllers/cartController");
const { auth, allowedTo } = require("../controllers/authController");
const {
  addProductToCartValidator,
  deleteProductFromCartValidator,
  updateCartItemQuantityValidator,
} = require("../utils/validators/cartValidator");

const router = express.Router();

router
  .route("/")
  .post(auth, allowedTo("user"),
   addProductToCartValidator, 
   addProductToCart)
  .get(auth, allowedTo("user"), getLoggedUserCart)
  .delete(auth, allowedTo("user"), clearCart);

router
  .route("/:id")
  .delete(
    auth,
    allowedTo("user"),
    deleteProductFromCartValidator,
    deleteProductFromCart,
  )
  .patch(
    auth,
    allowedTo("user"),
    updateCartItemQuantityValidator,
    updateCartItemQuantity,
  );

module.exports = router;
