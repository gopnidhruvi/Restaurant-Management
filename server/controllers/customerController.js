const customerModel = require("../models/customerModel");
const billModel = require("../models/billModel");

// Create Customer
exports.createCustomer = async (req, res, next) => {
    try {
        const {
            name,
            phone,
            date_of_birth,
            notes
        } = req.body;

        // Check for duplicate phone per restaurant
        const existing = await customerModel.findOne({
            phone,
            is_deleted: false
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Customer with this phone number already exists"
            });
        }

        const customer = await customerModel.create({
            name,
            phone,
            date_of_birth: date_of_birth || undefined,
            notes: notes || ""
        });

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: customer
        });
    } catch (err) {
        next(err);
    }
};

// Get All Customers
exports.getCustomers = async (req, res, next) => {
    try {
        const {search } = req.query;
        const filter = { is_deleted: false };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        const customers = await customerModel
            .find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers
        });
    } catch (err) {
        next(err);
    }
};

// Get Customer By ID
exports.getCustomerById = async (req, res, next) => {
    try {
        const customer = await customerModel.findById(req.params.id);

        if (!customer || customer.is_deleted) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (err) {
        next(err);
    }
};

// Search Customer by Phone
exports.searchByPhone = async (req, res, next) => {
    try {
        const { phone } = req.query;
        const filter = { phone, is_deleted: false };

        const customer = await customerModel.findOne(filter);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (err) {
        next(err);
    }
};

// Update Customer
exports.updateCustomer = async (req, res, next) => {
    try {
        const customer = await customerModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: customer
        });
    } catch (err) {
        next(err);
    }
};

// Get Customer Bill History
exports.getCustomerBillHistory = async (req, res, next) => {
    try {
        const bills = await billModel
            .find({
                customer_id: req.params.id,
                is_deleted: false,
                payment_status: "Paid"
            })
            .populate("order_id", "order_number order_type")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bills.length,
            data: bills
        });
    } catch (err) {
        next(err);
    }
};

// Delete Customer (Soft)
exports.deleteCustomer = async (req, res, next) => {
    try {
        const customer = await customerModel.findByIdAndUpdate(
            req.params.id,
            { is_deleted: true, status: "inactive" },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};
