const router = require("express").Router();
const { createRestaurant, getRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant, changeRestaurantStatus, recoverRestaurant } = require("../controllers/restaurantController");

router.post("/", createRestaurant);
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.put("/:id", updateRestaurant);
router.delete("/:id", deleteRestaurant);
router.patch("/:id/recover", recoverRestaurant);
router.patch("/:id/status", changeRestaurantStatus);

module.exports = router;