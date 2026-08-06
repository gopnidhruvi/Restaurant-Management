const menuitemsModel = require("../models/menuitemsModel");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Create Menu Items
exports.createMenuItem = async (req, res, next) => {
    try {
        const { category_id, item_name, description, price } = req.body;
        let imageUrl = "";

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.path,
                "menu-items"
            );
            imageUrl = result.secure_url;
        }

        const menuItem = await menuitemsModel.create({ category_id, item_name, description, price, image: imageUrl });

        res.status(201).json({
            success: true,
            message: "Menu item created successfully",
            data: menuItem
        });
    } catch (err) {
        next(err);
    }
}

// Get all Menu Items
exports.getMenuItems = async (req, res, next) => {
    try {
        const items = await menuitemsModel.find().populate("category_id", "category_name");

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (err) {
        next(err);
    }
}

// Get item by id
exports.getMenuItemById = async (req, res, next) => {
    try {
        const item = await menuitemsModel.findById(req.params.id)
            .populate(
                "category_id",
                "category_name"
            );
        if (!item) {
            return res.status(404).json({
                success: false,
                message:
                    "Menu item not found"
            });
        }
        res.status(200).json({
            success: true,
            data: item
        });

    } catch (err) {
        next(err);
    }
}

// Update item
exports.updateMenuItem = async (req, res, next) => {
    try {
        const updateData = {
            ...req.body
        };

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.path,
                "menu-items"
            );

            updateData.image = result.secure_url;
        }

        const item = await menuitemsModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true
            }
        );
        res.status(200).json({
            success: true,
            message:
                "Menu item updated successfully",
            data: item
        });
    } catch (err) {
        next(err);
    }
}

// Change Status
exports.changeStatus = async (req, res, next) => {
    try {
        const item = await menuitemsModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: item
        });
    } catch (err) {
        next(err);
    }
};

// Delete Menu item
exports.deleteMenuItem = async (req, res, next) => {
    try {
        const item = await menuitemsModel.findByIdAndUpdate(req.params.id, { is_deleted: true }, { new: true });

        res.status(200).json({
            success: true,
            message: "Menu item deleted successfully"
        });
    } catch (err) {
        next(err);
    }
}

// Restore Menu item
exports.restoreMenuItem = async (req, res, next) => {
    try {
        const item = await menuitemsModel.findByIdAndUpdate(req.params.id, { is_deleted: false }, { new: true });

        res.status(200).json({
            success: true,
            message: "Menu item restored successfully"
        });
    } catch (err) {
        next(err);
    }
}

// Get Menu Items By Category
exports.getMenuItemsByCategory = async (req, res, next) => {
    try {
        const items = await menuitemsModel
            .find({
                category_id: req.params.id,
                is_deleted: false
            })
            .populate(
                "category_id",
                "category_name"
            );

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (err) {
        next(err);
    }
}