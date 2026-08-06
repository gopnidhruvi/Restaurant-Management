const router = require("express").Router();
const { createOrder, getOrders, getOrderById, changeOrderStatus, deleteOrder, getOrdersByTable, getPendingOrders, getCompletedOrders, addItemsToOrder, sendToKitchen } = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getOrders);
router.patch("/:id/status", changeOrderStatus);
router.patch("/:id/items", addItemsToOrder);
router.delete("/:id", deleteOrder);
router.get("/table/:id", getOrdersByTable);
router.get("/pending", getPendingOrders);
router.get("/completed", getCompletedOrders);
router.get("/:id", getOrderById);
router.put("/send-to-kitchen/:id", sendToKitchen);

module.exports = router;