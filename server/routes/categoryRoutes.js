const router = require("express").Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory, restoreCategory, changeCategoryStatus } = require("../controllers/categoryController");
const upload = require("../middleware/upload.middleware");

router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);
router.patch("/:id/restore", restoreCategory);
router.patch("/:id/status", changeCategoryStatus);

module.exports = router;