const mongoose = require("mongoose");

const FundingSchema = new mongoose.Schema({
    company: String,
    funding: String,
    round: String,
    date: Date,
});

module.exports = mongoose.model("Funding", FundingSchema);
