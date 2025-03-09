const express = require("express");
const { getFundingData } = require("../controllers/FundingController");

const router = express.Router();

router.get("/", getFundingData); // Fetch all data dynamically

module.exports = router;
