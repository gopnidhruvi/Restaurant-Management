const counterModel = require("../models/counterModel");

exports.getNextNumber = async (name) => {
    const counter = await counterModel.findOneAndUpdate(
        { name },
        { $inc: { sequence: 1 } },
        { new: true, upsert: true }
    );

    return counter.sequence;
};