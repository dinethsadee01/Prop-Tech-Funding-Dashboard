const mongoose = require("mongoose");
const xlsx = require("xlsx");
const dotenv = require("dotenv");
const Funding = require("./models/Funding");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Read Excel File
const workbook = xlsx.readFile("mern-project/server/utils/Funding Database_DS.xlsx");
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Format and Save Data to MongoDB
const importData = async () => {
    try {
        await Funding.deleteMany(); // Clear existing data
        await Funding.insertMany(data);
        console.log("✅ Data Imported Successfully");
        mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error importing data:", error);
        mongoose.disconnect();
    }
};

importData();
