const { getAll, getOne } = require("./handlersFactory");
const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("../config/cloudinary");

exports.getAllUsers = getAll(userModel);
exports.getUserById = getOne(userModel);

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new apiError("No User For This ID", 404));
  }

  if (user.profileImage?.public_id) {
    cloudinary.uploader.destroy(user.profileImage.public_id).catch(() => {
      console.log(
        "Failed to delete image from cloudinary:",
        user.profileImage.public_id,
      );
    });
  }

  res.status(204).send();
});

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return next(new apiError("No User for this id", 404));
  }

  // update simple fields
  ["name", "phone"].forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  // update address (merge)
  if (req.body.address) {
    user.address = {
      ...user.address,
    ...JSON.parse(req.body.address),
    };
  }

  // update profile image
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "users");

    if (user.profileImage?.public_id) {
      cloudinary.uploader.destroy(user.profileImage.public_id).catch(() => {});
    }

    user.profileImage = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  await user.save();

  res.status(200).json({
    message: "success",
    data: user,
  });
});
