const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    table_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true
    },
    customer_name: {
      type: String,
      default: ""
    },
    waiter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    order_number: {
      type: String,
      required: true,
      unique: true
    },

    order_type: {
      type: String,
      enum: ["Dine In", "Takeaway", "Delivery"],
      default: "Dine In"
    },

    items: [
      {
        menu_item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem"
        },
        item_name: String,
        price: {
          type: Number,
          required: true,
          min: 0
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        total: Number
      }
    ],

    total_amount: {
      type: Number,
      default: 0
    },

    discount: {
      type: Number,
      default: 0,
      min: 0
    },

    grand_total: {
      type: Number,
      default: 0
    },

    payment_status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending"
    },

    order_status: {
      type: String,
      enum: [
        "Pending",
        "Preparing",
        "Ready",
        "Served",
        "Completed",
        "Cancelled"
      ],
      default: "Pending"
    },

    notes: {
      type: String
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

module.exports = mongoose.model("Order", orderSchema);