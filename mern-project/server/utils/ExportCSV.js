const { Parser } = require("json2csv");

const exportCSV = (data, fields, filename) => {
    try {
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);

        return {
            csv,
            filename: filename || "export.csv",
        };
    } catch (error) {
        console.error("Error exporting CSV:", error);
        throw new Error("Failed to export CSV");
    }
};

module.exports = exportCSV;
