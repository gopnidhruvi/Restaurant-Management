const restaurantModel = require("../models/restaurantModel");

// CREATE RESTAURANT
exports.createRestaurant = async (req, res, next) => {
    try {
        const restaurant = await restaurantModel.create(req.body);

        res.status(201).json({
            success: true,
            message: "Restaurant created successfully",
            data: restaurant,
        });
    } catch (err) {
        next(err);
    }
}

// GET RESTAURANT
exports.getRestaurants = async (req, res, next) => {
    try {
        const restaurant = await restaurantModel.find().sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            message: "Restaurant created successfully",
            count: restaurant.length,
            data: restaurant,
        });
    } catch (err) {
        next(err);
    }
}

// GET RESTAURANT BY ID
exports.getRestaurantById = async (req, res, next) => {
    try {
        const restaurant = await restaurantModel.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }

        res.status(200).json({
            success: true,
            data: restaurant,
        });
    } catch (err) {
        next(err)
    }
};

// UPDATE RESTAURANT
exports.updateRestaurant = async (req, res, next) => {
    try {
        const restaurant = await restaurantModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }

        res.status(200).json({
            success: true,
            data: restaurant,
        });
    } catch (err) {
        next(err)
    }
};

// DELETE RESTAURANT
exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    next(err);
  }
};

exports.changeRestaurantStatus = async (req, res, next) => {
  try {
    const restaurant = await restaurantModel.findById(req.params.id);

    restaurant.status =
      restaurant.status === "active" ? "inactive" : "active";

    await restaurant.save();

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    next(err);
  }
};

exports.recoverRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    next(err);
  }
};