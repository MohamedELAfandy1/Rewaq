const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const userModel = require("../../models/userModel");
const pendingUserModel = require("../../models/pendingUserModel");

exports.signupValidator = [
  check("name").notEmpty().withMessage("Name Is Required"),
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email Format")
    .custom(async (value) => {
      const user = await userModel.findOne({ email: value });
      const pending = await pendingUserModel.findOne({ email: value });
      if (user || pending) {
        throw new Error("Email already used");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("Password Is Required")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirm Is Required")
    .custom((passwordConfirm, { req }) => {
      if (passwordConfirm !== req.body.password) {
        throw new Error("Password Confirm Incorrect");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.verifyAccountValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email Format"),
  check("otp")
    .notEmpty()
    .withMessage("OTP Is Required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP"),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email Format"),
  check("password").notEmpty().withMessage("Password Is Required"),
  validatorMiddleware,
];

exports.forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email Address"),
  validatorMiddleware,
];

exports.verifyPasswordResetCodeValidator = [
  check("passwordResetCode")
    .notEmpty()
    .withMessage("Password Reset Code Is Required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid Password Reset Code"),
  validatorMiddleware,
];

exports.resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email Format"),
  check("newPassword").notEmpty().withMessage("New Password Is Required"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirm Is Required")
    .custom((passwordConfirm, { req }) => {
      if (passwordConfirm !== req.body.newPassword) {
        throw new Error("Password Confirm Incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];
