import React, { useState } from "react";
import "../styles/FundingTable.css";

const FundingTable = ({ data, currentPage, setCurrentPage, totalRecords }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const recordsPerPage = 25;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";

        if (typeof aValue === "number" && typeof bValue === "number") {
            return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        }

        return sortConfig.direction === "asc"
            ? aValue.toString().localeCompare(bValue.toString())
            : bValue.toString().localeCompare(aValue.toString());
    });

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

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

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
                    {sortedData.length > 0 ? (
                        sortedData.map((row, index) => (
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

            {/* Pagination Controls */}
            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    ⬅ Prev
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next ➡
                </button>
            </div>
        </div>
    );
};

export default FundingTable;
