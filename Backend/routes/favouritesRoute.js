const express = require("express");
const { auth, allowedTo } = require("../controllers/authController");
const {
  addProductToFavourites,
  removeProductFromFavourites,
  getLoggedUserFavourites,
} = require("../controllers/favouritesController");
const {
  addProductToFavouritesValidator,
  removeProductFromFavouritesValidator,
} = require("../utils/validators/favouritesValidator");
const router = express.Router();

router
  .route("/")
  .get(auth, allowedTo("user"), getLoggedUserFavourites)
  .post(
    auth,
    allowedTo("user"),
    addProductToFavouritesValidator,
    addProductToFavourites,
  )
  .delete(
    auth,
    allowedTo("user"),
    removeProductFromFavouritesValidator,
    removeProductFromFavourites,
  );
module.exports = router;
