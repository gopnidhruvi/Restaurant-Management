const waitingEntryModel = require("../models/waitingEntryModel");
const tableModel = require("../models/tableModel");
const customerModel = require("../models/customerModel");
const orderModel = require("../models/orderModel");
const { generateToken } = require("../utils/counter");

// Add to Waiting List
exports.addToWaiting = async (req, res, next) => {
    try {
        const {
            customer_name,
            phone,
            party_size,
            estimated_wait_minutes,
            notes
        } = req.body;

        let customer = await customerModel.findOne({
            phone,
            is_deleted: false
        });

        if (!customer) {
            customer = await customerModel.create({
                name: customer_name,
                phone
            });
        }

        const alreadyWaiting = await waitingEntryModel.findOne({
            customer_id: customer._id,
            status: "Waiting"
        });

        if (alreadyWaiting) {
            return res.status(400).json({
                success: false,
                message: "Customer is already in waiting list"
            });
        }

        const token_number = await generateToken();

        const entry = await waitingEntryModel.create({
            customer_name,
            phone,
            party_size,
            token_number,
            estimated_wait_minutes: estimated_wait_minutes || 30,
            notes: notes || ""
        });

        res.status(201).json({
            success: true,
            message: "Added to waiting list successfully",
            data: entry
        });
    } catch (err) {
        next(err);
    }
};

// Get Waiting List
exports.getWaitingList = async (req, res, next) => {
    try {
        const { status } = req.query;
        const filter = { is_deleted: false };

        if (status) {
            filter.status = status;
        } else {
            filter.status = "Waiting";
        }

        const entries = await waitingEntryModel
            .find(filter)
            .populate("table_id", "tableNumber capacity")
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });
    } catch (err) {
        next(err);
    }
};

// Get Entry By ID
exports.getWaitingEntryById = async (req, res, next) => {
    try {
        const entry = await waitingEntryModel
            .findById(req.params.id)
            .populate("table_id", "tableNumber capacity");

        if (!entry || entry.is_deleted) {
            return res.status(404).json({
                success: false,
                message: "Waiting entry not found"
            });
        }

        res.status(200).json({
            success: true,
            data: entry
        });
    } catch (err) {
        next(err);
    }
};

// Seat Customer (assign table)
exports.seatCustomer = async (req, res, next) => {
    try {
        const { table_id } = req.body;

        // Find waiting entry
        const entry = await waitingEntryModel.findById(req.params.id);

        if (!entry || entry.is_deleted) {
            return res.status(404).json({
                success: false,
                message: "Waiting entry not found"
            });
        }

        // Customer must be Waiting
        if (entry.status !== "Waiting") {
            return res.status(400).json({
                success: false,
                message: "Customer is not in waiting status"
            });
        }

        // Table is required
        if (!table_id) {
            return res.status(400).json({
                success: false,
                message: "Table ID is required"
            });
        }

        // Find table
        const table = await tableModel.findById(table_id);

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Table not found"
            });
        }

        // Check table availability
        if (table.status !== "available") {
            return res.status(400).json({
                success: false,
                message: "Table is not available"
            });
        }

        // Check table capacity
        if (entry.party_size > table.capacity) {
            return res.status(400).json({
                success: false,
                message: "Table capacity is not enough"
            });
        }

        // Occupy table and save customer name
        await tableModel.findByIdAndUpdate(
            table_id,
            {
                status: "occupied",
                customer_name: entry.customer_name
            }
        );

        // Update waiting entry
        entry.status = "Seated";
        entry.table_id = table_id;
        entry.seated_at = new Date();

        await entry.save();

        res.status(200).json({
            success: true,
            message: "Customer seated successfully",
            data: {
                waiting_entry_id: entry._id,
                customer_name: entry.customer_name,
                token_number: entry.token_number,
                table_id: entry.table_id,
                status: entry.status,
                seated_at: entry.seated_at
            }
        });

    } catch (err) {
        next(err);
    }
};

// Update Waiting Entry Status
exports.updateWaitingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const entry = await waitingEntryModel.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Waiting entry not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: entry
        });
    } catch (err) {
        next(err);
    }
};

// Update Estimated Wait Time
exports.updateWaitTime = async (req, res, next) => {
    try {
        const { estimated_wait_minutes } = req.body;

        const entry = await waitingEntryModel.findByIdAndUpdate(
            req.params.id,
            { estimated_wait_minutes },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Waiting entry not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Wait time updated",
            data: entry
        });
    } catch (err) {
        next(err);
    }
};

// Delete Waiting Entry (Soft)
exports.deleteWaitingEntry = async (req, res, next) => {
    try {
        const entry = await waitingEntryModel.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Waiting entry not found"
            });
        }

        // If customer was seated and had a table assigned
        if (entry.table_id) {
            await tableModel.findByIdAndUpdate(entry.table_id, {
                status: "Available"
            });
        }

        entry.is_deleted = true;
        entry.status = "Cancelled";
        await entry.save();

        res.status(200).json({
            success: true,
            message: "Waiting entry removed successfully"
        });
    } catch (err) {
        next(err);
    }
};