const kitchenModel = require("../models/kitchenModel");
const orderModel = require("../models/orderModel");

exports.getKitchenOrders = async (req, res, next) => {
    try {
        const kitchenOrders = await kitchenModel
            .find({
                kitchen_status: {
                    $ne: "Served"
                }
            })
            .populate("order_id", "order_number order_type customer_name")
            .populate("table_id", "tableNumber")
            .populate("waiter_id", "name")
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: kitchenOrders.length,
            data: kitchenOrders
        });

    } catch (err) {
        next(err);
    }
};

exports.getKitchenOrderById = async (req, res, next) => {
    try {

        const kitchenOrder = await kitchenModel
            .findById(req.params.id)
            .populate("order_id")
            .populate("table_id")
            .populate("waiter_id", "name");

        if (!kitchenOrder) {
            const error = new Error("Kitchen order not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: kitchenOrder
        });

    } catch (err) {
        next(err);
    }
};

exports.acceptKitchenOrder = async (req, res, next) => {
    try {
        const kitchenOrder = await kitchenModel.findById(req.params.id);

        if (!kitchenOrder) {
            const error = new Error("Kitchen order not found");
            error.statusCode = 404;
            throw error;
        }

        if (kitchenOrder.kitchen_status !== "Pending") {
            const error = new Error("Only pending orders can be accepted");
            error.statusCode = 400;
            throw error;
        }

        kitchenOrder.kitchen_status = "Preparing";

        kitchenOrder.items.forEach(item => {
            if (item.status === "Pending") {
                item.status = "Preparing";
            }
        });

        await kitchenOrder.save();

        const order = await orderModel.findById(kitchenOrder.order_id);

        if (order) {
            order.items.forEach(orderItem => {
                const kitchenItem = kitchenOrder.items.find(
                    kitchenItem =>
                        kitchenItem.menu_item_id.toString() ===
                        orderItem.menu_item_id.toString()
                );

                if (kitchenItem && kitchenItem.status === "Preparing") {
                    orderItem.kitchen_status = "Preparing";
                }
            });

            await order.save();
        }

        res.status(200).json({
            success: true,
            message: "Kitchen order accepted successfully",
            data: kitchenOrder
        });
    } catch (err) {
        next(err);
    }
};

exports.readyKitchenOrder = async (req, res, next) => {
    try {
        const kitchenOrder = await kitchenModel.findById(req.params.id);

        if (!kitchenOrder) {
            const error = new Error("Kitchen order not found");
            error.statusCode = 404;
            throw error;
        }

        if (kitchenOrder.kitchen_status !== "Preparing") {
            const error = new Error("Order must be Preparing");
            error.statusCode = 400;
            throw error;
        }

        kitchenOrder.kitchen_status = "Ready";

        kitchenOrder.items.forEach(item => {
            if (item.status === "Preparing") {
                item.status = "Ready";
            }
        });

        await kitchenOrder.save();

        const order = await orderModel.findById(kitchenOrder.order_id);

        if (order) {
            order.items.forEach(orderItem => {
                const kitchenItem = kitchenOrder.items.find(
                    kitchenItem =>
                        kitchenItem.menu_item_id.toString() ===
                        orderItem.menu_item_id.toString()
                );

                if (kitchenItem && kitchenItem.status === "Ready") {
                    orderItem.kitchen_status = "Ready";
                }
            });

            await order.save();
        }

        res.status(200).json({
            success: true,
            message: "Food is ready",
            data: kitchenOrder
        });

    } catch (err) {
        next(err);
    }
};

exports.servedKitchenOrder = async (req, res, next) => {
    try {
        const kitchenOrder = await kitchenModel.findById(req.params.id);

        if (!kitchenOrder) {
            const error = new Error("Kitchen order not found");
            error.statusCode = 404;
            throw error;
        }

        if (kitchenOrder.kitchen_status !== "Ready") {
            const error = new Error("Order is not ready");
            error.statusCode = 400;
            throw error;
        }

        kitchenOrder.kitchen_status = "Served";

        kitchenOrder.items.forEach(item => {
            if (item.status === "Ready") {
                item.status = "Served";
            }
        });

        await kitchenOrder.save();

        const order = await orderModel.findById(kitchenOrder.order_id);

        if (order) {
            order.items.forEach(orderItem => {
                const kitchenItem = kitchenOrder.items.find(
                    kitchenItem =>
                        kitchenItem.menu_item_id.toString() ===
                        orderItem.menu_item_id.toString()
                );

                if (kitchenItem && kitchenItem.status === "Served") {
                    orderItem.kitchen_status = "Served";
                }
            });

            await order.save();
        }

        res.status(200).json({
            success: true,
            message: "Order served successfully",
            data: kitchenOrder
        });

    } catch (err) {
        next(err);
    }
};


exports.getDisplayScreen = async (req, res, next) => {
    try {
        const kitchenOrders = await kitchenModel
            .find({
                kitchen_status: {
                    $in: ["Pending", "Preparing", "Ready"]
                }
            })
            .populate(
                "order_id",
                "order_number order_type customer_name token_number"
            )
            .populate(
                "table_id",
                "tableNumber"
            )
            .sort({
                createdAt: 1
            });

        if (!kitchenOrders || kitchenOrders.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No active kitchen orders",
                data: {
                    current_token: null,
                    current_status: null,
                    queue: []
                }
            });
        }

        // First/latest token to show prominently
        const currentOrder = kitchenOrders[0];

        // Remaining tokens
        const queue = kitchenOrders.slice(1).map(order => ({
            kitchen_id: order._id,
            token_number: order.order_id.token_number,
            status: order.kitchen_status
        }));

        res.status(200).json({
            success: true,
            data: {
                current_token: currentOrder.order_id.token_number,
                current_status: currentOrder.kitchen_status,
                queue
            }
        });
    } catch (err) {
        next(err);
    }
};