const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Mock funding data (Replace with MongoDB query later)
const fundingData = [
    { id: 1, company: "Startup A", funding: "$10M", round: "Series A" },
    { id: 2, company: "Startup B", funding: "$5M", round: "Seed" },
];

// API Route
app.get("/api/funding-data", (req, res) => {
    res.json(fundingData);
});

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log('MongoDB Connected'))
//     .catch(err => console.log(err));

// app.get('/', (req, res) => {
//     res.send('Backend is running...');
// });

//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
