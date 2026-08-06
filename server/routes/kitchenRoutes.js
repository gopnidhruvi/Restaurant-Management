const router = require("express").Router();
const {
    updateDisplayConfig,
    getKitchenDisplayOrders,
    markOrderPreparing,
    markOrderReady,
    generateKitchenSlip
} = require("../controllers/kitchenController");

router.get("/generate-slip", generateKitchenSlip);
router.put("/config/:restaurant_id", updateDisplayConfig);
router.get("/kitchen/:restaurant_id", getKitchenDisplayOrders);
router.patch("/orders/:order_id/preparing", markOrderPreparing);
router.patch("/orders/:order_id/ready", markOrderReady);

module.exports = router;
