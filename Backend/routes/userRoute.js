const express = require("express");
const router = express.Router();
const {
  updateLoggedUserData,
  getLoggedUserData,
  getAllUsers,
  deleteUser,
  getUserById,
} = require("../controllers/userController");
const { auth, allowedTo } = require("../controllers/authController");
const upload = require("../middleware/uploadImage");
const {
  checkIdValidator,
  updateUserValidator,
} = require("../utils/validators/userValidator");

router.get("/myProfile", auth, getLoggedUserData, getUserById);
router.patch(
  "/updateProfile",
  auth,
  upload.single("profileImage"),
  updateUserValidator,
  updateLoggedUserData,
);

router.route("/").get(auth, allowedTo("admin"), getAllUsers);
router
  .route("/:id")
  .get(auth, allowedTo("admin"), checkIdValidator, getUserById)
  .delete(auth, allowedTo("admin"), checkIdValidator, deleteUser);

module.exports = router;
