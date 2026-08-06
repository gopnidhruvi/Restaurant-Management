const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({    
    category_name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: "",
    },

    image: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    }
);

categorySchema.index(
    {
        category_name: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model("Category", categorySchema);