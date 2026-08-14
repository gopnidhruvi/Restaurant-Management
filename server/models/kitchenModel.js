const mongoose = require("mongoose");

const kitchenSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        waiter_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        kot_no: {
            type: String,
            required: true,
            unique: true,
        },
        table_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Table",
            required: true,
        },

        items: [
            {
                menu_item_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "MenuItem",
                },

                name: String,
                quantity: Number,
                note: String,
                status: {
                    type: String,
                    enum: ["Pending", "Preparing", "Ready", "Served"],
                    default: "Pending",
                },
            },
        ],
        kitchen_status: {
            type: String,
            enum: ["Pending", "Preparing", "Ready", "Served", "Cancelled"],
            default: "Pending",
        },

        printed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("kitchen", kitchenSchema);