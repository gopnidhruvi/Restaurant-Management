const mongoose = require("mongoose");

const displayVideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    video_url: {
        type: String,
        required: true
    },

    is_active: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("DisplayVideo", displayVideoSchema);