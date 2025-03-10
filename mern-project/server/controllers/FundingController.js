const Funding = require("../models/FundingModel");

// Get all funding data (Public Access)
const getFundingData = async (req, res) => {
    try {
        const data = await Funding.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Create new funding entry (Admin Only)
const createFundingData = async (req, res) => {
    try {
        const newFunding = new Funding(req.body);
        await newFunding.save();
        res.status(201).json(newFunding);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Update funding data (Admin Only)
const updateFundingData = async (req, res) => {
    try {
        const updatedFunding = await Funding.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedFunding);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Delete funding data (Admin Only)
const deleteFundingData = async (req, res) => {
    try {
        await Funding.findByIdAndDelete(req.params.id);
        res.json({ message: "Funding data deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { getFundingData, createFundingData, updateFundingData, deleteFundingData };
