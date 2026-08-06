const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
    {
        restaurant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },

        po_number: {
            type: String,
            required: true,
            unique: true
        },

        supplier_name: {
            type: String,
            required: true
        },

        supplier_contact: {
            type: String,
            default: ""
        },

        items: [
            {
                ingredient_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Ingredient",
                    required: true
                },
                ingredient_name: String,
                quantity: {
                    type: Number,
                    required: true
                },
                unit: String,
                cost_per_unit: Number,
                total_cost: Number
            }
        ],

        total_amount: {
            type: Number,
            default: 0
        },

        expected_delivery_date: {
            type: Date
        },

        received_date: {
            type: Date
        },

        status: {
            type: String,
            enum: ["draft", "ordered", "received", "cancelled"],
            default: "draft"
        },

        notes: {
            type: String,
            default: ""
        },

        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
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

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
