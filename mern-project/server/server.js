// Initiate the server and connect to MongoDB Atlas
// Import the required packages and files
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import the required files
const { MONGO_URI, PORT } = require("./config/config");
const authRoutes = require("./routes/AuthRoutes");
const fundingRoutes = require("./routes/fundingRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define API Routes
app.use("/api/auth", authRoutes);
app.use("/api/funding-data", fundingRoutes);

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
