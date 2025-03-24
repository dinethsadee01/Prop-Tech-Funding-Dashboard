import React from "react";
import "../styles/FundingTable.css";

const FundingTable = ({ data, onSort, sortConfig }) => {
    // Remove local sorting logic and use parent's sortConfig
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        onSort(key, direction);
    };

    const columns = [
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

    return (
        <div className="funding-table-container">
            <table className="funding-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col} onClick={() => handleSort(col)}>
                                {col} {sortConfig.key === col ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col) => (
                                    <td key={col}>{row[col] || "-"}</td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="no-data">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FundingTable;
