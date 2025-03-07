const mongoose = require("mongoose");
const xlsx = require("xlsx");
const Funding = require("./models/Funding"); // Import MongoDB Model
const db = require("./config/db"); // MongoDB Connection

// Load Excel File
const workbook = xlsx.readFile("Funding Database_DS.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = xlsx.utils.sheet_to_json(sheet);

// Automatically get column names and insert into MongoDB
const importData = async () => {
    try {
        await Funding.deleteMany(); // Clear old data

        const formattedData = jsonData.map((row) => {
            let mappedRow = {};
            Object.keys(row).forEach((key) => {
                mappedRow[key.replace(/\s+/g, "_").toLowerCase()] = row[key]; // Format keys
            });
            return mappedRow;
        });

        await Funding.insertMany(formattedData);
        console.log("✅ Data Imported Successfully");
        mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error:", error);
        mongoose.disconnect();
    }
};

importData();
