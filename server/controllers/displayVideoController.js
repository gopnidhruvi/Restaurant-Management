const displayVideoModel = require("../models/displayVideoModel");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

exports.addDisplayVideo = async (req, res, next) => {
    try {
        const { title } = req.body;

        if (!title) {
            const error = new Error("Title is required");
            error.statusCode = 400;
            throw error;
        }

        if (!req.file) {
            const error = new Error("Video file is required");
            error.statusCode = 400;
            throw error;
        }

        const video = await displayVideoModel.create({
            title: title,
            video_url: req.file.path,
            is_active: true
        });

        res.status(201).json({
            success: true,
            message: "Display video added successfully",
            data: video
        });

    } catch (err) {
        next(err);
    }
};

exports.getDisplayVideos = async (req, res, next) => {
    try {
        const videos = await displayVideoModel
            .find({
                is_active: true
            })
            .sort({
                createdAt: 1
            });

        const data = videos.map(video => ({
            _id: video._id,
            title: video.title,
            video_url: `${req.protocol}://${req.get("host")}/${video.video_url.replace(/\\/g, "/")}`,
            is_active: video.is_active
        }));

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (err) {
        next(err);
    }
}