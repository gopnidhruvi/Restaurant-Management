const kitchenModel = require("../models/kitchenModel");
const menuitemsModel = require("../models/menuitemsModel");
const orderModel = require("../models/orderModel");
const tableModel = require("../models/tableModel");
const userModel = require("../models/userModel");
const { getNextNumber, generateToken } = require("../utils/counter");

exports.createOrder = async (req, res, next) => {
    try {
        const {
            table_id,
            waiter_id,
            customer_name,
            waiting_entry_id,
            order_type,
            discount = 0,
            notes,
            items
        } = req.body;

        const table = await tableModel.findById(table_id);

        if (!table) {
            throw error = new Error("Table not found");
            error.statusCode = 404;
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            const error = new Error("At least one order item is required");
            error.statusCode = 400;
            throw error;
        }

        let finalTokenNumber;
        let finalCustomerName = customer_name || "";

        if (waiting_entry_id) {
            finalTokenNumber = await generateToken();
            const waitingEntry = await waitingEntryModel.findById(
                waiting_entry_id
            );

            if (!waitingEntry || waitingEntry.is_deleted) {
                const error = new Error("Waiting entry not found");
                error.statusCode = 404;
                throw error;
            }

            if (waitingEntry.status !== "Seated") {
                const error = new Error(
                    "Customer must be seated before creating order"
                );
                error.statusCode = 400;
                throw error;
            }

            finalTokenNumber = waitingEntry.token_number;
            finalCustomerName = waitingEntry.customer_name;
        } else {
            finalTokenNumber = await generateToken();
        }

        if (waiter_id) {
            const waiter = await userModel.findOne({
                _id: waiter_id,
                role: "waiter",
                is_deleted: false
            });

            if (!waiter) {
                const error = new Error("Waiter not found");
                error.statusCode = 404;
                throw error;
            }
        }

        const existingOrder = await orderModel.findOne({
            table_id,
            is_deleted: false,
            order_status: {
                $nin: ["Completed", "Cancelled"]
            }
        });

        if (existingOrder) {
            const error = new Error(
                "Active order already exists. Please use Add Items API."
            );
            error.statusCode = 400;
            throw error;
        }

        let orderItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const menuItem = await menuitemsModel.findById(item.menu_item_id);

            if (!menuItem) {
                throw error = new Error("Menu Item not found");
                error.statusCode = 404;
            }

            const total = menuItem.price * item.quantity;

            totalAmount += total;

            orderItems.push({
                menu_item_id: menuItem._id,
                item_name: menuItem.item_name,
                price: menuItem.price,
                quantity: item.quantity,
                total,
                is_sent_to_kitchen: false
            });
        }

        const grandTotal = totalAmount - discount;

        const orderNumber = await getNextNumber("order");
        const order = await orderModel.create({
            table_id,
            waiting_entry_id: waiting_entry_id || null,
            waiter_id,
            customer_name: finalCustomerName,
            token_number: finalTokenNumber,
            order_number: `ORD-${orderNumber}`,
            order_type,
            items: orderItems,
            total_amount: totalAmount,
            discount,
            grand_total: grandTotal,
            notes
        });
        await tableModel.findByIdAndUpdate(
            table_id,
            {
                status: "occupied"
            }
        );

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });
    } catch (err) {
        next(err);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await orderModel
            .find()
            .populate("table_id", "tableNumber")
            .populate("waiter_id", "name");

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const orders = await orderModel
            .findById(req.params.id)
            .populate("table_id", "tableNumber")
            .populate("waiter_id", "name");

        if (!orders) {
            const error = new Error("Order not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
}

exports.changeOrderStatus = async (req, res, next) => {
    try {
        const order = await orderModel.findByIdAndUpdate(
            req.params.id,
            {
                order_status: req.body.order_status
            },
            {
                new: true
            }
        );

        if (!order) {
            const error = new Error("Order not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });
    } catch (err) {
        next(err);
    }
};

exports.addItemsToOrder = async (req, res, next) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            const error = new Error("Items are required");
            error.statusCode = 400;
            throw error;
        }

        const order = await orderModel.findById(req.params.id);

        if (!order || order.is_deleted) {
            const error = new Error("Order not found");
            error.statusCode = 404;
            throw error;
        }

        if (order.order_status === "Completed" || order.order_status === "Cancelled") {
            const error = new Error("Cannot add items to this order");
            error.statusCode = 400;
            throw error;
        }

        let addedAmount = 0;

        for (const item of items) {
            if (!item.quantity || item.quantity <= 0) {
                const error = new Error("Quantity must be greater than 0");
                error.statusCode = 400;
                throw error;
            }
            const menuItem = await menuitemsModel.findById(item.menu_item_id);

            if (!menuItem) {
                const error = new Error("Menu item not found");
                error.statusCode = 404;
                throw error;
            }

            const total = menuItem.price * item.quantity;

            // Always add as a new item
            order.items.push({
                menu_item_id: menuItem._id,
                item_name: menuItem.item_name,
                price: menuItem.price,
                quantity: item.quantity,
                total,
                is_sent_to_kitchen: false,
                kitchen_status: "Pending"
            });
            addedAmount += total;
        }

        order.total_amount += addedAmount;
        order.grand_total = order.total_amount - order.discount;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Items added successfully",
            data: order
        });

    } catch (err) {
        next(err);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await orderModel.findById(req.params.id);

        if (!order || order.is_deleted) {
            throw error = new Error("Order not found");
            error.statusCode = 404;
        }

        order.is_deleted = true;
        await order.save();

        await tableModel.findByIdAndUpdate(
            order.table_id,
            {
                status: "Available"
            }
        );

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

exports.getOrdersByTable = async (req, res, next) => {
    try {
        const orders = await orderModel
            .find({
                table_id: req.params.id,
                is_deleted: false,
                order_status: {
                    $nin: ["Completed", "Cancelled"]
                }
            })
            .populate("table_id", "tableNumber")
            .populate("waiter_id", "name");

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

exports.getPendingOrders = async (req, res, next) => {
    try {
        const orders = await orderModel
            .find({
                order_status: "Pending",
                is_deleted: false
            })
            .populate("table_id", "tableNumber")
            .populate("waiter_id", "name");

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

exports.getCompletedOrders = async (req, res, next) => {
    try {
        const orders = await orderModel.find({ order_status: "Completed", is_deleted: false })
            .populate("table_id", "tableNumber")
            .populate("waiter_id", "name");

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

exports.sendToKitchen = async (req, res, next) => {
    try {
        const order = await orderModel.findById(req.params.id);

        if (!order || order.is_deleted) {
            const error = new Error("Order not found");
            error.statusCode = 404;
            throw error;
        }

        // Get only newly added items
        const pendingItems = order.items.filter(
            item => !item.is_sent_to_kitchen
        );

        if (pendingItems.length === 0) {
            const error = new Error(
                "No new items to send to kitchen"
            );
            error.statusCode = 400;
            throw error;
        }

        // Generate KOT number
        const kotNumber = await getNextNumber("kot");

        // Create new kitchen slip
        const kitchenSlip = await kitchenModel.create({
            order_id: order._id,
            table_id: order.table_id,
            waiter_id: order.waiter_id,
            kot_no: `KOT-${kotNumber}`,
            kitchen_status: "Pending",

            items: pendingItems.map(item => ({
                menu_item_id: item.menu_item_id,
                name: item.item_name,
                quantity: item.quantity,
                note: "",
                status: "Pending"
            }))
        });

        // Mark these items as sent
        pendingItems.forEach(item => {
            item.is_sent_to_kitchen = true;
            item.kitchen_status = "Pending";
        });

        await order.save();

        res.status(200).json({
            success: true,
            message: "Items sent to kitchen successfully",
            data: kitchenSlip
        });
    } catch (err) {
        next(err);
    }
};