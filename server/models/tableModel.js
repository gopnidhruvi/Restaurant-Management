const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
    {
        tableNumber: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        capacity: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: [
                "available",
                "occupied",
                "reserved",
                "cleaning",
            ],
            default: "available",
        },

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Table", tableSchema);