const router = require("express").Router();
const { createMenuItem, getMenuItems, getMenuItemById, updateMenuItem, changeStatus, deleteMenuItem, restoreMenuItem, getMenuItemsByCategory } = require("../controllers/menuitemsController");
const upload = require("../middleware/upload.middleware");

router.post("/", upload.single("image"), createMenuItem);
router.get("/", getMenuItems);
router.get("/:id", getMenuItemById);
router.put("/:id", upload.single("image"), updateMenuItem);
router.patch("/:id/status", changeStatus);
router.delete("/:id", deleteMenuItem);
router.patch("/:id/restore", restoreMenuItem);

router.get("/category/:id", getMenuItemsByCategory);

module.exports = router;