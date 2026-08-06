const kitchenModel = require("../models/kitchenModel");
const orderModel = require("../models/orderModel");

exports.generateKitchenSlip = async (req, res, next) => {
    try {
        const { order_id } = req.body;

        const order = await orderModel.findById(order_id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const alreadyExist = await kitchenSlipModel.findOne({
            order_id
        });

        if (alreadyExist) {
            return res.status(400).json({
                success: false,
                message: "Kitchen Slip already generated"
            });
        }

        const count = await kitchenSlipModel.countDocuments();

        const slip = await kitchenSlipModel.create({
            order_id: order._id,

            table_id: order.table_id,

            waiter_id: order.waiter_id,

            kot_no: `KOT-${1000 + count + 1}`,

            items: order.items.map(item => ({
                menu_item_id: item.menu_item_id,
                name: item.name,
                quantity: item.quantity,
                note: item.note
            }))
        });

        res.status(201).json({
            success: true,
            message: "Kitchen Slip Generated",
            data: slip
        });

    } catch (err) {
        next(err);
    }
};

// Update Display Config
exports.updateDisplayConfig = async (req, res, next) => {
    try {
        const { restaurant_id } = req.params;

        const config = await kitchenModel.findOneAndUpdate(
            { restaurant_id },
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Display config updated successfully",
            data: config
        });
    } catch (err) {
        next(err);
    }
};

// Get Kitchen Display Orders (live KDS feed)
exports.getKitchenDisplayOrders = async (req, res, next) => {
    try {
        const { restaurant_id } = req.params;

        const config = await kitchenModel.findOne({ restaurant_id });

        const statusFilter = config
            ? config.statuses_to_show
            : ["Pending", "Preparing", "Ready"];

        const orders = await orderModel
            .find({
                restaurant_id,
                order_status: { $in: statusFilter },
                is_deleted: false
            })
            .populate("table_id", "tableNumber")
            .populate("waiter_id", "name")
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            config: config || {},
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

// Mark Order as Preparing from Kitchen Display
exports.markOrderPreparing = async (req, res, next) => {
    try {
        const order = await orderModel.findByIdAndUpdate(
            req.params.order_id,
            { order_status: "Preparing" },
            { new: true }
        );

        // if (!order) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Order not found"
        //     });
        // }

        res.status(200).json({
            success: true,
            message: "Order marked as Preparing",
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// Mark Order Ready from Kitchen Display
exports.markOrderReady = async (req, res, next) => {
    try {
        const order = await orderModel.findByIdAndUpdate(
            req.params.order_id,
            { order_status: "Ready" },
            { new: true }
        );

        // if (!order) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Order not found"
        //     });
        // }

        res.status(200).json({
            success: true,
            message: "Order marked as Ready",
            data: order
        });
    } catch (err) {
        next(err);
    }
};