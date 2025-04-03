const Funding = require("../models/FundingModel");
const ExportCSV = require("../utils/exportCSV");
const { currencyFields } = require("../../shared/config/column.config");

// Helper function to check if a field is a currency field
const isCurrencyField = (field) => {
    return currencyFields.includes(field);
};

// Helper function to handle currency field sorting with MongoDB aggregation
const handleSortingWithAggregation = async (filter, sortBy, sortDirection, skip, limit) => {
    
    const sort = sortDirection === 'desc' ? -1 : 1;

    let pipeline = filter ? [{ $match: filter }] : [];
    
    // Currency field conversion for proper numeric sorting
    pipeline = [
        ...pipeline,
        {
            $addFields: {
                numericSortField: {
                    $cond: {
                        if: { $eq: [{ $type: `$${sortBy}` }, "string"] },
                        then: {
                            $toDouble: {
                                $cond: {
                                    if: { $regexMatch: { input: { $ifNull: [`$${sortBy}`, "0"] }, regex: /^\$/ } },
                                    then: { 
                                        $replaceAll: { 
                                            input: { $substr: [{ $ifNull: [`$${sortBy}`, "0"] }, 1, -1] },
                                            find: ",", 
                                            replacement: "" 
                                        } 
                                    },
                                    else: { 
                                        $replaceAll: { 
                                            input: { $ifNull: [`$${sortBy}`, "0"] },
                                            find: ",", 
                                            replacement: "" 
                                        } 
                                    }
                                }
                            }
                        },
                        else: { $ifNull: [`$${sortBy}`, 0] }
                    }
                }
            }
        },
        { $sort: { numericSortField: sort } },
        { $skip: skip },
        { $limit: parseInt(limit) }
    ];
    
    const total = await Funding.countDocuments(filter || {});
    const results = await Funding.aggregate(pipeline);
    
    return { records: results, total: total };
};

// Get all funding data (Public Access)
const getFundingData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || null;
        const sortDirection = req.query.sortDirection || 'asc';

        // If sorting by a currency field, use aggregation pipeline
        if (sortBy && isCurrencyField(sortBy)) {
            const result = await handleSortingWithAggregation(
                null, // No filter for getFundingData
                sortBy,
                sortDirection,
                skip,
                limit
            );
            
            res.json({records: result.records, total: result.total});
        } else {
            // Standard sorting for non-currency fields
            const sortOptions = {};
            if (sortBy) {
                sortOptions[sortBy] = sortDirection === 'desc' ? -1 : 1;
            }

            const total = await Funding.countDocuments();
            const data = await Funding.find()
                .sort(sortOptions)
                .collation({ locale: 'en', strength: 2 })
                .skip(skip)
                .limit(limit);

            res.json({ records: data, total: total });
        }
    } catch (error) {
        console.error("Error in getFundingData:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//Get funding data by ID (Public Access)
const getFundingDataById = async (req, res) => {
    try {
        const funding = await Funding.findById(req.params.id);
        res.json(funding);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get funding data by name (Admin Only)
const getFundingDataByName = async (req, res) => {
    try {
        const funding = await Funding.findOne({ Name: req.params.name });
        if (!funding) {
            return res.status(404).json({ message: "Funding data not found" });
        }
        res.json(funding);
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
        const { query, page = 1, limit = 25, sortBy, sortDirection } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

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

        // If sorting by a currency field, use aggregation pipeline
        if (sortBy && isCurrencyField(sortBy)) {
            const result = await handleSortingWithAggregation(
                filter,
                sortBy,
                sortDirection,
                skip,
                limit
            );
            
            res.json(result);
        } else {
            // Standard sorting for non-currency fields
            const sortOptions = {};
            if (sortBy) {
                sortOptions[sortBy] = sortDirection === 'desc' ? -1 : 1;
            }

            const total = await Funding.countDocuments(filter);
            const results = await Funding.find(filter)
                .sort(sortOptions)
                .collation({ locale: 'en', strength: 2 })
                .skip(skip)
                .limit(parseInt(limit));

            res.json({ records: results, total });
        }
    } catch (error) {
        console.error("Error in normalSearch:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Search & Filter funding data (Public Access)
const searchFundingData = async (req, res) => {
    try {
        const { 
            name, city, state, minFunding, maxFunding, fundingRounds, 
            minYear, maxYear, minYearsActive, maxYearsActive, 
            minFounders, maxFounders, page = 1, limit = 25,
            sortBy, sortDirection
        } = req.query;

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

        // If sorting by a currency field, use aggregation pipeline
        if (sortBy && isCurrencyField(sortBy)) {
            const result = await handleSortingWithAggregation(
                filter,
                sortBy,
                sortDirection,
                skip,
                limit
            );
            
            res.json(result);
        } else {
            // Standard sorting for non-currency fields
            const sortOptions = {};
            if (sortBy) {
                sortOptions[sortBy] = sortDirection === 'desc' ? -1 : 1;
            }

            const total = await Funding.countDocuments(filter);
            const results = await Funding.find(filter)
                .sort(sortOptions)
                .collation({ locale: 'en', strength: 2 })
                .skip(skip)
                .limit(parseInt(limit));

            res.json({ records: results, total });
        }
    } catch (error) {
        console.error("Error in searchFundingData:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Export funding data to CSV (Public Access)
const exportFundingData = async (req, res) => {
    try {
        // Get search/filter/sort parameters from the frontend
        const query = req.query;

        // Find data based on the provided query (if any)
        const fundingData = await Funding.find(query);

        if (!fundingData || fundingData.length === 0) {
            return res.status(404).json({ message: "No data available to export" });
        }

        // Extract fields dynamically from the existing data
        const fields = Object.keys(fundingData[0].toObject());

        // Convert to CSV
        const { csv, filename } = ExportCSV(fundingData, fields, "exported_data.csv");

        // Send CSV response
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.status(200).send(csv);
    } catch (error) {
        console.error("Error exporting funding data:", error);
        res.status(500).json({ message: "Failed to export funding data" });
    }
};

module.exports = { getFundingData, getFundingDataById, getFundingDataByName, createFundingData, updateFundingData, deleteFundingData, searchFundingData, normalSearch, exportFundingData };
