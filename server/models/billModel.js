const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        bill_number: {
            type: String,
            required: true,
            unique: true
        },

        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer"
        },

        items: [
            {
                menu_item_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "MenuItem"
                },
                item_name: String,
                price: Number,
                quantity: Number,
                total: Number
            }
        ],

        sub_total: {
            type: Number,
            default: 0
        },

        discount_amount: {
            type: Number,
            default: 0
        },

        tax_percent: {
            type: Number,
            default: 0
        },

        tax_amount: {
            type: Number,
            default: 0
        },

        grand_total: {
            type: Number,
            default: 0
        },

        payment_method: {
            type: String,
            enum: ["Cash", "Card", "UPI"],
            default: "Cash"
        },

        payment_status: {
            type: String,
            enum: ["Pending", "Paid", "Refunded"],
            default: "Pending"
        },

        notes: {
            type: String,
            default: ""
        },

        is_deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Bill", billSchema);
