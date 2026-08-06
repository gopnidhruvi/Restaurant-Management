const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        
        phone: {
            type: String,
            required: true
        },

        date_of_birth: {
            type: Date
        },

        notes: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
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

module.exports = mongoose.model("Customer", customerSchema);