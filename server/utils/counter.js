const counterModel = require("../models/counterModel");
const orderModel = require("../models/orderModel");
const waitingEntryModel = require("../models/waitingEntryModel");

exports.getNextNumber = async (name) => {
    const counter = await counterModel.findOneAndUpdate(
        { name },
        { $inc: { sequence: 1 } },
        { new: true, upsert: true }
    );

    return counter.sequence;
};

exports.generateToken = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's waiting entries
    const waitingEntries = await waitingEntryModel
        .find({
            createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        })
        .select("token_number");

    // Get today's orders
    const orders = await orderModel
        .find({
            createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        })
        .select("token_number");

    let highestToken = 0;

    // Check waiting tokens
    for (const entry of waitingEntries) {
        if (entry.token_number) {
            const number = parseInt(
                entry.token_number.replace("TKN-", "")
            );

            if (number > highestToken) {
                highestToken = number;
            }
        }
    }

    // Check order tokens
    for (const order of orders) {
        if (order.token_number) {
            const number = parseInt(
                order.token_number.replace("TKN-", "")
            );

            if (number > highestToken) {
                highestToken = number;
            }
        }
    }

    const nextNumber = highestToken + 1;

    return `TKN-${String(nextNumber).padStart(3, "0")}`;
};