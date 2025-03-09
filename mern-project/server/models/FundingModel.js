const mongoose = require("mongoose");
const { COLLECTION_NAME } = require("../config/config");

const FundingSchema = new mongoose.Schema({}, { strict: false });

const Funding = mongoose.model("Funding", FundingSchema, COLLECTION_NAME);
module.exports = Funding;