// Initiate the server and connect to MongoDB Atlas
// Import the required packages and files
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MONGO_URI, PORT } = require("./config/Config");
const fundingRoutes = require("./routes/FundingRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/funding-data", fundingRoutes);

// Connect to MongoDB Atlas
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
