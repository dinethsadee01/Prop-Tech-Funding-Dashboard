const express = require("express");
const { getFundingData, createFundingData, updateFundingData, deleteFundingData } = require("../controllers/fundingController");
const { authenticateUser, authorizeAdmin } = require("../middleware/AuthMiddleware");

const router = express.Router();

// ✅ Public Route: Anyone can view data
router.get("/", getFundingData);

// ✅ Protected Routes: Only Admins can modify data
router.post("/", authenticateUser, authorizeAdmin, createFundingData);
router.put("/:id", authenticateUser, authorizeAdmin, updateFundingData);
router.delete("/:id", authenticateUser, authorizeAdmin, deleteFundingData);

module.exports = router;