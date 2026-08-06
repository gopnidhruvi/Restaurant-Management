const router = require("express").Router();
const { createStaff, getStaff, getStaffByRestaurant, updateStaff, changeStaffStatus, deleteStaff, restoreStaff, getStaffById } = require("../controllers/staffController");

router.post("/", createStaff);
router.get("/", getStaff);
router.get("/:id", getStaffById);
router.get("/restaurant/:id", getStaffByRestaurant);
router.put("/:id", updateStaff);
router.patch("/:id/status", changeStaffStatus);
router.delete("/:id", deleteStaff);
router.patch("/:id/restore", restoreStaff);

module.exports = router;