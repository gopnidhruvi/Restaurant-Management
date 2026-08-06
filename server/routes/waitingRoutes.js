const router = require("express").Router();
const {
    addToWaiting,
    getWaitingList,
    getWaitingEntryById,
    seatCustomer,
    updateWaitingStatus,
    updateWaitTime,
    deleteWaitingEntry
} = require("../controllers/waitingController");

router.post("/", addToWaiting);
router.get("/", getWaitingList);
router.get("/:id", getWaitingEntryById);
router.patch("/:id/seat", seatCustomer);
router.patch("/:id/status", updateWaitingStatus);
router.patch("/:id/wait-time", updateWaitTime);
router.delete("/:id", deleteWaitingEntry);

module.exports = router;