const billModel = require("../models/billModel");
const orderModel = require("../models/orderModel");
const tableModel = require("../models/tableModel");
const { getNextNumber } = require("../utils/counter");

// Generate Bill
exports.generateBill = async (req, res, next) => {
    try {
        const {
            order_id,
            payment_method = "Cash"
        } = req.body;

        const order = await orderModel.findById(order_id);

        if (!order || order.is_deleted) {
            const error = new Error("Order not found");
            error.statusCode = 404;
            throw error;
        }

        if (order.order_status === "Cancelled") {
            const error = new Error("Cannot generate bill for cancelled order");
            error.statusCode = 400;
            throw error;
        }

        const existingBill = await billModel.findOne({
            order_id,
            is_deleted: false
        });

        if (existingBill) {
            const error = new Error("Bill already generated");
            error.statusCode = 400;
            throw error;
        }
        // Billing Calculations
        const subTotal = order.total_amount;
        const discountAmount = order.discount;
        const taxPercent = 1;
        const taxableAmount = Math.max(0, subTotal - discountAmount);
        const taxAmount = Number(((taxableAmount * taxPercent) / 100).toFixed(2));
        const grandTotal = Number((taxableAmount + taxAmount).toFixed(2));
        const billNumber = await getNextNumber("bill");
        const bill = await billModel.create({
            order_id,
            bill_number: `BILL-${billNumber}`,
            items: order.items,
            sub_total: subTotal,
            discount_amount: discountAmount,
            tax_percent: taxPercent,
            tax_amount: taxAmount,
            grand_total: grandTotal,
            payment_method,
            payment_status: "Pending",
            notes: order.notes
        });

        res.status(201).json({
            success: true,
            message: "Bill generated successfully",
            data: bill
        });
    } catch (err) {
        next(err);
    }
};

// Confirm Payment
exports.confirmPayment = async (req, res, next) => {
    try {
        const { payment_method } = req.body;
        const bill = await billModel.findById(req.params.id);
        if (!bill || bill.is_deleted) {
            return res.status(404).json({
                success: false,
                message: "Bill not found"
            });
        }
        if (bill.payment_status === "Paid") {
            return res.status(400).json({
                success: false,
                message: "Bill already paid"
            });
        }
        bill.payment_status = "Paid";
        if (payment_method) {
            bill.payment_method = payment_method;
        }
        await bill.save();
        // Update order payment status and mark table available
        const order = await orderModel.findById(bill.order_id);
        if (order) {
            order.payment_status = "Paid";
            order.order_status = "Completed";
            await order.save();
            if (order.table_id) {
                await tableModel.findByIdAndUpdate(
                    order.table_id,
                    { status: "Cleaning" }
                );
                setTimeout(async () => {
                    try {
                        await tableModel.findByIdAndUpdate(
                            order.table_id,
                            {
                                status: "available"
                            }
                        );
                    } catch (err) {
                        console.log(err);
                    }
                }, 10 * 60 * 1000);
            }
        }

        res.status(200).json({
            success: true,
            message: "Payment confirmed successfully",
            data: bill
        });
    } catch (err) {
        next(err);
    }
};

// Get all Bills
exports.getBills = async (req, res, next) => {
    try {
        const { payment_status, from, to } = req.query;

        const filter = { is_deleted: false };

        if (payment_status) filter.payment_status = payment_status;

        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }

        const bills = await billModel
            .find(filter)
            .populate("order_id", "order_number order_type")
            .populate("customer_id", "name phone")
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

// Get Bill By ID
exports.getBillById = async (req, res, next) => {
    try {
        const bill = await billModel
            .findById(req.params.id)
            .populate("order_id")
            .populate("customer_id", "name phone email")

        if (!bill || bill.is_deleted) {
            return res.status(404).json({
                success: false,
                message: "Bill not found"
            });
        }

        res.status(200).json({
            success: true,
            data: bill
        });
    } catch (err) {
        next(err);
    }
};

// Refund Bill
// exports.refundBill = async (req, res, next) => {
//     try {
//         const bill = await billModel.findById(req.params.id);

//         if (!bill || bill.is_deleted) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Bill not found"
//             });
//         }

//         if (bill.payment_status !== "Paid") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Only paid bills can be refunded"
//             });
//         }

//         bill.payment_status = "Refunded";
//         await bill.save();

//         // Reverse loyalty points earned
//         if (bill.customer_id) {
//             await customerModel.findByIdAndUpdate(
//                 bill.customer_id,
//                 {
//                     $inc: {
//                         total_spent: -bill.grand_total
//                     }
//                 }
//             );
//         }

//         res.status(200).json({
//             success: true,
//             message: "Bill refunded successfully",
//             data: bill
//         });
//     } catch (err) {
//         next(err);
//     }
// };

// Get KOT (Kitchen Order Ticket) for an order
// exports.getKOT = async (req, res, next) => {
//     try {
//         const order = await orderModel
//             .findById(req.params.order_id)
//             .populate("table_id", "tableNumber")
//             .populate("waiter_id", "name");

//         if (!order || order.is_deleted) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Order not found"
//             });
//         }

//         const kot = {
//             kot_number: "KOT-" + order._id.toString().slice(-6).toUpperCase(),
//             order_number: order.order_number,
//             table: order.table_id,
//             waiter: order.waiter_id,
//             order_type: order.order_type,
//             items: order.items,
//             notes: order.notes,
//             created_at: order.createdAt
//         };

//         res.status(200).json({
//             success: true,
//             data: kot
//         });
//     } catch (err) {
//         next(err);
//     }
// };

// Delete Bill (Soft)
// exports.deleteBill = async (req, res, next) => {
//     try {
//         const bill = await billModel.findByIdAndUpdate(
//             req.params.id,
//             { is_deleted: true },
//             { new: true }
//         );

//         if (!bill) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Bill not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Bill deleted successfully"
//         });
//     } catch (err) {
//         next(err);
//     }
// };