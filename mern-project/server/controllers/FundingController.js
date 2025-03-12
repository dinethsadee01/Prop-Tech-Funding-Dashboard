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

// Search & Filter funding data (Public Access)
const searchFundingData = async (req, res) => {
    try {
        const { name, city, state, minFunding, maxFunding, fundingRounds, minYear, maxYear, minYearsActive, maxYearsActive, minFounders, maxFounders } = req.query;
        let filter = {};
        if (name) filter["Name"] = { $regex: name, $options: "i" };
        if (city) filter["City"] = { $regex: city, $options: "i" };
        if (state) filter["State"] = { $regex: state, $options: "i" };

        // Search by Funding Rounds (Must be between 0-9)
        if (fundingRounds !== undefined) {
            const parsedRounds = Number(fundingRounds);
            if (!isNaN(parsedRounds) && parsedRounds >= 0 && parsedRounds <= 9) {
                filter["# of Funding Rounds"] = parsedRounds;
            }
        };

        // Search by Founded Year (Range: minYear - maxYear)
        if (minYear || maxYear) {
            filter.Founded = {};
            if (minYear) filter.Founded.$gte = Number(minYear);
            if (maxYear) filter.Founded.$lte = Number(maxYear);
        };

        // Search by Years Active (Range)
        if (minYearsActive || maxYearsActive) {
            filter["Years Active"] = {};
            if (minYearsActive) filter["Years Active"].$gte = Number(minYearsActive);
            if (maxYearsActive) filter["Years Active"].$lte = Number(maxYearsActive);
        };

        // Search by # Founders (Range: 1-20)
        if (minFounders || maxFounders) {
            filter["# Founders"] = {};
            if (minFounders) filter["# Founders"].$gte = Number(minFounders);
            if (maxFounders) filter["# Founders"].$lte = Number(maxFounders);
        }

        // Search by Total Funding (Range: minFunding - maxFunding)
        if (minFunding || maxFunding) {
            const allData = await Funding.find({}, { "Total Funding": 1 });

            // Convert "Total Funding" values to numbers
            const validIds = allData
                .filter((doc) => {
                    if (!doc["Total Funding"]) return false; // Skip missing values
                    const cleanNumber = Number(doc["Total Funding"].replace(/[$,]/g, ""));
                    return (
                        (!minFunding || cleanNumber >= Number(minFunding)) &&
                        (!maxFunding || cleanNumber <= Number(maxFunding))
                    );
                })
                .map((doc) => doc._id);

            filter._id = { $in: validIds };  // Filter by valid document IDs
        };

        const result = await Funding.find(filter);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { getFundingData, createFundingData, updateFundingData, deleteFundingData, searchFundingData };
