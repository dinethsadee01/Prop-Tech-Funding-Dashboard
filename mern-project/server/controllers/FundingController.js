const Funding = require("../models/FundingModel");
const ExportCSV = require("../utils/exportCSV");

// Get all funding data (Public Access)
const getFundingData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;
        const skip = (page - 1) * limit;

        const total = await Funding.countDocuments();
        const data = await Funding.find().skip(skip).limit(limit);
        
        res.json({ records: data, total: total });
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

// Normal Search bar (Public Access)
const normalSearch = async (req, res) => {
    try {
        const { query, page = 1, limit = 25 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        if (!query) return res.json({ records: [], total: 0 }); // Return empty array if no query

        const searchRegex = new RegExp(query, "i"); // Case-insensitive regex

        const filter = {
            $or: [
                { Name: searchRegex },
                { "Prop Type": searchRegex },
                { AngelList: searchRegex },
                { Crunchbase: searchRegex },
                { Domain: searchRegex },
                { "HQ Address": searchRegex },
                { City: searchRegex },
                { State: searchRegex },
            ],
        };

        console.log("Search Filter:", filter); // ✅ Debugging

        const total = await Funding.countDocuments(filter);
        const results = await Funding.find(filter).skip(skip).limit(parseInt(limit));
        
        res.json({ records: results, total: total });
    } catch (error) {
        console.error("Error in normalSearch:", error); // ❌ Log error
        res.status(500).json({ message: "Server Error", error });
    }
};

// Search & Filter funding data (Public Access)
const searchFundingData = async (req, res) => {
    try {
        const { name, city, state, minFunding, maxFunding, fundingRounds, minYear, maxYear, 
               minYearsActive, maxYearsActive, minFounders, maxFounders, page = 1, limit = 25 } = req.query;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
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

        const total = await Funding.countDocuments(filter);
        const results = await Funding.find(filter).skip(skip).limit(parseInt(limit));
        
        res.json({ records: results, total: total });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

const exportFundingData = async (req, res) => {
    try {
        // Get search/filter/sort parameters from the frontend
        const query = req.query;

        // Find data based on the provided query (if any)
        const fundingData = await FundingModel.find(query);

        if (!fundingData || fundingData.length === 0) {
            return res.status(404).json({ message: "No data available to export" });
        }

        // Extract fields dynamically from the existing data
        const fields = Object.keys(fundingData[0].toObject());

        // Convert to CSV
        const { csv, filename } = exportCSV(fundingData, fields, "exported_data.csv");

        // Send CSV response
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.status(200).send(csv);
    } catch (error) {
        console.error("Error exporting funding data:", error);
        res.status(500).json({ message: "Failed to export funding data" });
    }
};

module.exports = { getFundingData, createFundingData, updateFundingData, deleteFundingData, searchFundingData, normalSearch, exportFundingData };
