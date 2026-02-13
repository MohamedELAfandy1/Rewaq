const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const apiError = require("../apiError");
const productModel = require("../../models/productModel");
const categoryModel = require("../../models/categoryModel");

exports.createProductValidator = [
  check("code")
    .notEmpty()
    .withMessage("Product Code Required")
    .custom(async (value) => {
      const product = await productModel.findOne({ code: value });
      if (product) {
        throw new Error("Product with this code already exists");
      }
    }),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to category")
    .custom(async (value) => {
      const category = await categoryModel.findById(value);
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    }),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be number")
    .custom(async (value, { req }) => {
      const category = await categoryModel.findById(req.body.category);
      const price = Number(req.body.price ?? category.price);
      if (!price) {
        throw new Error("Price is required to compare with discount");
      }
      if (Number(value) > price) {
        throw new Error("Price after discount must be less than price");
      }
      return true;
    }),

  check("quantity")
    .notEmpty()
    .withMessage("Quantity Is Required")
    .isNumeric()
    .withMessage("Quantity must be number"),

  check("sold").optional().isNumeric().withMessage("Sold must be number"),
  check("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags, { req }) => {
      req.body.tagsText = tags.join(" ");
      return true;
    }),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID"),

  check("code")
    .optional()
    .custom(async (value, { req }) => {
      const product = await productModel.findOne({
        code: value,
        _id: { $ne: req.params.id },
      });
      if (product) {
        throw new Error("Product with this code already exists");
      }
      return true;
    }),

  check("category")
    .optional()
    .custom(async (value) => {
      const category = await categoryModel.findById(value);
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    }),

  check("price").optional().isNumeric().withMessage("Price must be number"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be number")

    .custom(async (value, { req }) => {
      const product = await productModel.findById(req.params.id);
      const price = Number(req.body.price ?? product.price);
      if (!price) {
        throw new Error("Price is required to compare with discount");
      }
      if (Number(value) > price) {
        throw new Error("Price after discount must be less than price");
      }
      return true;
    }),

  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be number"),

  check("sold").optional().isNumeric().withMessage("Sold must be number"),
  check("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags, { req }) => {
      req.body.tagsText = tags.join(" ");
      return true;
    }),

  validatorMiddleware,
];

exports.getProductByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID"),
  validatorMiddleware,
];
