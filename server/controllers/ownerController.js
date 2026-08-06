const restaurantModel = require("../models/restaurantModel");
const userModel = require("../models/userModel");

// Create Owner
exports.createOwner = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        const owner = await userModel.create({
            name,
            email,
            password,
            phone,
            role: "owner"
        });

        res.status(201).json({
            success: true,
            message: "Owner created successfully",
            data: owner
        });

    } catch (err) {
        next(err);
    }
};

// Get All Owners
exports.getOwners = async (req, res, next) => {
    try {
        const owners = await userModel.find({
            role: "owner"
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: owners.length,
            data: owners
        });

    } catch (err) {
        next(err);
    }
};

// Get Single Owner
exports.getOwnerById = async (req, res, next) => {
    try {

        const owner = await userModel.findOne({
            _id: req.params.id,
            role: "owner"
        });

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner not found"
            });
        }

        res.status(200).json({
            success: true,
            data: owner
        });

    } catch (err) {
        next(err);
    }
};

// Update Owner
exports.updateOwner = async (req, res, next) => {
    try {
        const owner = await userModel.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "owner"
            },
            req.body,
            {
                new: true,
            }
        );

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Owner updated successfully",
            data: owner
        });
    } catch (err) {
        next(err)
    }
};

// Delete Owner (Soft Delete)
exports.deleteOwner = async (req, res, next) => {
    try {
        const owner = await userModel.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "owner"
            },
            {
                is_deleted: true
            },
            {
                new: true
            }
        );

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Owner deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};

// Restore Owner
exports.restoreOwner = async (req, res, next) => {
    try {
        const owner = await userModel.findOneAndUpdate({ _id: req.params.id, role: "owner" }, {
            is_deleted: false
        },
            {
                new: true
            });

        res.status(200).json({
            success: true,
            message: "Owner restored successfully",
            data: owner
        });
    } catch (err) {
        next(err);
    }
}

// Change owner status
exports.changeOwnerStatus = async (req, res, next) => {
    try {
        const owner = await userModel.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Owner status updated to ${req.body.status}`,
            data: owner,
        });
    } catch (err) {
        next(err);
    }
};