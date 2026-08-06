const { default: mongoose } = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    restaurant_name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    phone: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        default: "India",
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
        versionKey: 0
    }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);