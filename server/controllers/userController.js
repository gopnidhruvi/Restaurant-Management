const User = require("../models/userModel");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email,
            is_deleted: false
        }).populate("restaurant_id");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.status === "blocked") {
            return res.status(400).json({
                success: false,
                message: "User is blocked"
            });
        }

        if (user.password !== password) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
exports.getCurrentUser = (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not Logged In"
        });
    }

    res.json({
        success: true,
        data: req.session.user
    });
};