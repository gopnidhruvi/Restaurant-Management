
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: [
                "super_admin",
                "owner",
                "manager",
                "waiter",
                "kitchen"
            ],
            required: true
        },

        restaurant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant"
        },

        status: {
            type: String,
            enum: ["active", "blocked"],
            default: "active"
        },

        is_deleted: {
            type: Boolean,
            default: false
        },
        permissions:[
        {
            module:{
                type:String
            },

            actions:[
                {
                    type:String
                }
            ]
        }
    ]
        
    },
    {
        timestamps: true,
        versionKey: 0
    }
);

module.exports = mongoose.model("Users", userSchema);