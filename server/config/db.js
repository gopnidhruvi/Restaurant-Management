const { default: mongoose } = require("mongoose")

exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected");
    } catch (err) {
        console.log("DB error:", err.message);
        process.exit(1);
    }
};