const router = require("express").Router();
const {
    getKitchenOrders,
    getKitchenOrderById,
    acceptKitchenOrder,
    readyKitchenOrder,
    servedKitchenOrder
} = require("../controllers/kitchenController");

router.get("/orders", getKitchenOrders);
router.get("/orders/:id", getKitchenOrderById);
router.put("/accept/:id", acceptKitchenOrder);
router.put("/ready/:id", readyKitchenOrder);
router.put("/served/:id", servedKitchenOrder);

module.exports = router;
