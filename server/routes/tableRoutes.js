const router = require("express").Router();
const { createTable, getAllTables, getTableById, updateTable, deleteTable, restoreTable, updateTableStatus } = require("../controllers/tableController");

router.post("/", createTable);
router.get("/", getAllTables);
router.get("/:id", getTableById);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);
router.patch("/:id/restore", restoreTable);
router.patch("/:id/status", updateTableStatus);

module.exports = router;