const router = require("express").Router();
const { createOwner, getOwners, getOwnerById, updateOwner, deleteOwner, restoreOwner, changeOwnerStatus } = require("../controllers/ownerController");

router.post("/", createOwner);
router.get("/", getOwners);
router.get("/:id", getOwnerById);
router.put("/:id", updateOwner);
router.delete("/:id", deleteOwner);
router.patch("/:id/restore", restoreOwner);
router.patch("/:id/status", changeOwnerStatus);

module.exports = router;