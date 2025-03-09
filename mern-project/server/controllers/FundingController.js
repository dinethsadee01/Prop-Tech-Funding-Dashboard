const Funding = require("../models/FundingModel");

// @desc Get all funding data dynamically
// @route GET /api/funding-data
const getFundingData = async (req, res) => {
    try {
        const fundingData = await Funding.find(); // Fetch all fields
        res.status(200).json(fundingData);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { getFundingData };