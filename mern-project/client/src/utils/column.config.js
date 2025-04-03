// Simple array of column names
export const columnNames = [
    "Name", "Technology", "Prop Type", "AngelList", "Crunchbase", "Domain", "HQ Address", "City", "State", "Zip",
    "# Founders", "Founded", "Years Active", "# of Funding Rounds", "Valuation Rank", "Funding/Year Rank",
    "Total Funding Rank", "ARR Rank", "CAFR Rank", "Avg. Funding/Year", "ARR/Funds Raised", "Total Funding",
    "Estimated ARR", "CFRGR (Compound Funding Round Growth Rate)", "CAFR", "Latest Valuation", "Latest Valuation Year",
    "Accelerator", "Accelerator 2", "Pre-Seed Date", "Pre-Seed $", "Seed Date", "Seed $", "Bridge Date", "Bridge $",
    "A Round Date", "A Round $", "B Round Date", "B Round $", "C Round Date", "C Round $", "D Round Date", "D Round $",
    "E Round Date", "E Round $", "F Round Date", "F Round $", "G Round Date", "G Round $", "H Round Date", "H Round $",
    "Unknown Series Date", "Unknown Series $", "Non-Dilutive Round Date", "Non-Dilutive Round $", "Exit Date", "Exit $",
    "Acquirer"
];

// Detailed array with column types for form inputs
export const columnDefinitions = [
    { name: "Name", type: "STRING" },
    { name: "Technology", type: "STRING" },
    { name: "Prop Type", type: "STRING" },
    { name: "AngelList", type: "STRING" },
    { name: "Crunchbase", type: "STRING" },
    { name: "Domain", type: "STRING" },
    { name: "HQ Address", type: "STRING" },
    { name: "City", type: "STRING" },
    { name: "State", type: "STRING" },
    { name: "Zip", type: "NUMBER" },
    { name: "# Founders", type: "NUMBER" },
    { name: "Founded", type: "YEAR" },
    { name: "Years Active", type: "NUMBER" },
    { name: "# of Funding Rounds", type: "NUMBER" },
    { name: "Valuation Rank", type: "NUMBER" },
    { name: "Funding/Year Rank", type: "NUMBER" },
    { name: "Total Funding Rank", type: "NUMBER" },
    { name: "ARR Rank", type: "NUMBER" },
    { name: "CAFR Rank", type: "NUMBER" },
    { name: "Avg. Funding/Year", type: "CURRENCY" },
    { name: "ARR/Funds Raised", type: "CURRENCY" },
    { name: "Total Funding", type: "CURRENCY" },
    { name: "Estimated ARR", type: "CURRENCY" },
    { name: "CFRGR (Compound Funding Round Growth Rate)", type: "PERCENTAGE" },
    { name: "CAFR", type: "PERCENTAGE" },
    { name: "Latest Valuation", type: "CURRENCY" },
    { name: "Latest Valuation Year", type: "YEAR" },
    { name: "Accelerator", type: "STRING" },
    { name: "Accelerator 2", type: "STRING" },
    { name: "Pre-Seed Date", type: "DATE" },
    { name: "Pre-Seed $", type: "CURRENCY" },
    { name: "Seed Date", type: "DATE" },
    { name: "Seed $", type: "CURRENCY" },
    { name: "Bridge Date", type: "DATE" },
    { name: "Bridge $", type: "CURRENCY" },
    { name: "A Round Date", type: "DATE" },
    { name: "A Round $", type: "CURRENCY" },
    { name: "B Round Date", type: "DATE" },
    { name: "B Round $", type: "CURRENCY" },
    { name: "C Round Date", type: "DATE" },
    { name: "C Round $", type: "CURRENCY" },
    { name: "D Round Date", type: "DATE" },
    { name: "D Round $", type: "CURRENCY" },
    { name: "E Round Date", type: "DATE" },
    { name: "E Round $", type: "CURRENCY" },
    { name: "F Round Date", type: "DATE" },
    { name: "F Round $", type: "CURRENCY" },
    { name: "G Round Date", type: "DATE" },
    { name: "G Round $", type: "CURRENCY" },
    { name: "H Round Date", type: "DATE" },
    { name: "H Round $", type: "CURRENCY" },
    { name: "Unknown Series Date", type: "DATE" },
    { name: "Unknown Series $", type: "CURRENCY" },
    { name: "Non-Dilutive Round Date", type: "DATE" },
    { name: "Non-Dilutive Round $", type: "CURRENCY" },
    { name: "Exit Date", type: "DATE" },
    { name: "Exit $", type: "CURRENCY" },
    { name: "Acquirer", type: "STRING" }
];

// Currency fields array for server-side sorting
export const currencyFields = [
    "Total Funding", "Pre-Seed $", "Seed $", "Bridge $", "A Round $", 
    "B Round $", "C Round $", "D Round $", "E Round $", "F Round $", 
    "G Round $", "H Round $", "Unknown Series $", "Non-Dilutive Round $", 
    "Exit $", "Latest Valuation", "Avg. Funding/Year", "Estimated ARR"
];

// Add CommonJS exports for Node.js environment (server-side)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        columnNames,
        columnDefinitions,
        currencyFields
    };
}