const mongoose = require("mongoose");
const xlsx = require("xlsx");
const dotenv = require("dotenv");
const Funding = require("./models/Funding");

dotenv.config(); // Load environment variables

// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// Load Excel File
const workbook = xlsx.readFile("Funding Database_DS.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = xlsx.utils.sheet_to_json(sheet);

// Automatically format column names and insert data
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
