const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const categoryModel = require("../models/categoryModel");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Create Category
exports.createCategory = async (req, res, next) => {
    try {
        const { category_name, description } = req.body;
        let imageUrl = "";

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.path,
                "restaurant-categories"
            );
            imageUrl = result.secure_url;
        }

        const category = await categoryModel.create({
            category_name,
            description,
            image: imageUrl,
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    } catch (err) {
        next(err);
    }
}

// Get All Category
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await categoryModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (err) {
        next(err);
    }
}

// Get Category By Id
exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await categoryModel.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (err) {
        next(err);
    }
}

// Update Category
exports.updateCategory = async (req, res, next) => {
    try {
        const updateData = {
            category_name: req.body.category_name,
            description: req.body.description
        };

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.path,
                "restaurant-categories"
            );

            updateData.image = result.secure_url;
        }

        const category = await categoryModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    } catch (err) {
        next(err);
    }
};

// Change Status
exports.changeCategoryStatus = async (req, res, next) => {
    try {
        const category = await categoryModel.findByIdAndUpdate(
            req.params.id,
            {
                status:
                    req.body.status
            },
            {
                new: true
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message:
                    "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Status updated successfully",
            data: category
        });

    } catch (err) {
        next(err);
    }
}

// Delete Category (Soft Delete)
exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await categoryModel.findByIdAndUpdate(req.params.id,
            {
                isDeleted: true,
                status: "inactive"
            },
            {
                new: true
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Category deleted successfully"
        });
    } catch (err) {
        next(err);
    }
}

// Restore Category
exports.restoreCategory = async (req, res, next) => {
    try {
        const category = await categoryModel.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: false,
                status: "active"
            },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Category restored successfully"
        });
    } catch (err) {
        next(err);
    }
}