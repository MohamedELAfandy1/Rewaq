const express = require("express");
const authRoute = require("./authRoute");
const categoryRoute = require("./categoryRoute");
const productRoute = require("./productRoute");
const favouritesRoute = require("./favouritesRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");
const userRoute = require("./userRoute");
const mountRoutes = (app) => {
  app.use("/auth", authRoute);
  app.use("/category", categoryRoute);
  app.use("/product", productRoute);
  app.use("/favourites", favouritesRoute);
  app.use("/cart", cartRoute);
  app.use("/order", orderRoute);
  app.use("/user", userRoute);
};

module.exports = mountRoutes;
