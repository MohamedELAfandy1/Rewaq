const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const productModel = require("../../models/productModel");
const cartModel = require("../../models/cartModel");
const apiError = require("../apiError");

exports.addProductToCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID Required")
    .isMongoId()
    .withMessage("Invalid Product ID Format")
    .custom(async (value) => {
      const product = await productModel.findOne({
        _id: value,
      });
      if (!product) {
        return Promise.reject(new Error("No Product For This ID"));
      }
      return true;
    }),

  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity Must Be A Number")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Quantity Must Be Greater Than 0");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateCartItemQuantityValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity Is Required")
    .isInt({ min: 1 })
    .withMessage("Quantity Must Be An Integer Greater Than 0"),
  validatorMiddleware,
];

exports.deleteProductFromCartValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  validatorMiddleware,
];
