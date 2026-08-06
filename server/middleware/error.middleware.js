const errorHandler = (err, req, res, next) => {
    let code = err.statusCode || 500;
    let message = err.message || "Internal server error";

    if (err.name === "ValidationError") {
        code = 400;
        message = Object.values(err.errors).map((err) => err.message).join(", ");
    }
    if (err.code === 11000) {
        // console.log(err.code);
        code = 400;
        message = "Duplicate field value entered";
    }
    if (err.name === "CastError") {
        // console.log(err);
        code = 400;
        message = `Invalid ${err.value}`;
    }
    res.status(code).json({
        success: false,
        message,
        data: null
    });
}

module.exports = errorHandler;