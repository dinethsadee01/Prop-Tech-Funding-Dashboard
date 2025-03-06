const express = require("express");
const Funding = require("../models/Funding");

const router = express.Router();

// Get all funding data
router.get("/", async (req, res) => {
    try {
        const fundingData = await Funding.find();
        res.json(fundingData);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
});

module.exports = router;
