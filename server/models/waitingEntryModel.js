const mongoose = require("mongoose");

const waitingEntrySchema = new mongoose.Schema(
    {
        customer_name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true
        },

        party_size: {
            type: Number,
            required: true,
            min: 1
        },

        token_number: {
            type: String,
            required: true
        },

        estimated_wait_minutes: {
            type: Number,
            default: 30
        },

        status: {
            type: String,
            enum: ["Waiting", "Seated", "Cancelled", "No Show"],
            default: "Waiting"
        },

        notes: {
            type: String,
            default: ""
        },

        seated_at: {
            type: Date
        },

        table_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Table"
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

module.exports = mongoose.model("WaitingEntry", waitingEntrySchema);
