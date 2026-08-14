const router = require("express").Router();
const {
    generateBill,
    confirmPayment,
    getBills,
    getBillById,
    refundBill,
    getKOT,
    deleteBill
} = require("../controllers/billingController");

// Bill routes
router.post("/", generateBill);
router.get("/", getBills);
router.get("/:id", getBillById);
router.patch("/:id/pay", confirmPayment);

module.exports = router;
