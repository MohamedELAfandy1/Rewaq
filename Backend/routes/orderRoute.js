const express = require("express");
const router = express.Router();
const {
  createOrder,
  createFilterObject,
  getAllOrders,
  getOrderById,
  updateOrderToDeliverd,
  updateOrderToPaid,
  cancelOrder,
  deleteOrder
} = require("../controllers/orderController");
const { auth, allowedTo } = require("../controllers/authController");
const {
  createOrderValidator,
  orderIDValidator,
  getOrderByIdValidator,
} = require("../utils/validators/orderValidator");

router
  .route("/")
  .post(auth, allowedTo("user"), createOrderValidator, createOrder)
  .get(auth, allowedTo("admin", "user"), createFilterObject, getAllOrders);

router
  .route("/:id")
  .get(auth, allowedTo("admin", "user"), getOrderByIdValidator, getOrderById)
  .delete(auth, allowedTo("admin"), orderIDValidator, deleteOrder);
router
  .route("/:id/cancel")
  .patch(auth, allowedTo("admin"), orderIDValidator, cancelOrder);
router
  .route("/:id/pay")
  .patch(auth, allowedTo("admin"), orderIDValidator, updateOrderToPaid);
router
  .route("/:id/deliver")
  .patch(auth, allowedTo("admin"), orderIDValidator, updateOrderToDeliverd);

module.exports = router;
