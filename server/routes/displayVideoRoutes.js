const router = require("express").Router();
const { getDisplayVideos, addDisplayVideo } = require("../controllers/displayVideoController");
const upload = require("../middleware/upload.middleware");

router.post("/videos",upload.single("video"), addDisplayVideo);
router.get("/videos", getDisplayVideos);

module.exports = router;