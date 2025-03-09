const express = require("express");
const { getFundingData } = require("../controllers/fundingController");

const router = express.Router();

router.get("/", getFundingData); // Fetch all data dynamically

module.exports = router;
