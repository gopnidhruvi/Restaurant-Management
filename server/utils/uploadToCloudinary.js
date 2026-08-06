const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadToCloudinary = async (filePath, folder) => {
    const result = await cloudinary.uploader.upload(filePath, {
        folder
    });

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    return result;
};

module.exports = uploadToCloudinary;