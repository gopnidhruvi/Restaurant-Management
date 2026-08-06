const express = require("express");
const router = express.Router();

const { login, getCurrentUser } = require("../controllers/userController");

router.post("/login", login);
router.get("/me",getCurrentUser)

module.exports = router;