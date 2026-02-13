const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const categoryModel = require("../../models/categoryModel");
const apiError = require("../apiError");

exports.getCategoryByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID"),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID"),
  validatorMiddleware,
];
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category Name Required")
    .custom((value) => {
      return categoryModel.findOne({ name: value }).then((category) => {
        if (category) {
          return Promise.reject(
            new Error("Category by this name is already defiend"),
          );
        }
      });
    }),

  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .custom((value, { req }) => {
      return categoryModel.findOne({ name: value }).then((category) => {
        if (category && category.name !== req.body.name) {
          return Promise.reject(
            new Error("Category by this name is already defiend"),
          );
        }
      });
    }),

  validatorMiddleware,
];
