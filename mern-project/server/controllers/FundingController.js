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
        const { name, city, state, minFunding, maxFunding } = req.query;
        let filter = {};
        if (name) filter["Name"] = { $regex: name, $options: "i" };
        if (city) filter["City"] = { $regex: city, $options: "i" };
        if (state) filter["State"] = { $regex: state, $options: "i" };

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
        }
        const result = await Funding.find(filter);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { getFundingData, createFundingData, updateFundingData, deleteFundingData, searchFundingData };
