const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const { check } = require("express-validator");
const productModel = require("../../models/productModel");

exports.addProductToFavouritesValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid Product ID Format")
    .custom((value) =>
      productModel.findById(value).then((product) => {
        if (!product) {
          return Promise.reject(new Error("No Product For This ID"));
        }
      }),
    ),
  validatorMiddleware,
];

exports.removeProductFromFavouritesValidator = [
  check("productId")
    .isMongoId()
    .withMessage("InValid Product ID Format")
    .custom((value) =>
      productModel.findById(value).then((product) => {
        if (!product) {
          return Promise.reject(new Error("No Product For This ID"));
        }
      }),
    ),
  validatorMiddleware,
];
