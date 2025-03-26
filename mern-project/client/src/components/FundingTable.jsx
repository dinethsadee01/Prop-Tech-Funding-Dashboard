import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import "../styles/FundingTable.css";

const FundingTable = ({ data, onSort, sortConfig, onRowClick, isAdmin = false }) => {
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
        <TableContainer className="funding-table-container">
            <Table stickyHeader className="funding-table">
                <TableHead>
                    <TableRow>
                        {columns.map((col, colIndex) => (
                            <TableCell 
                                key={col} 
                                onClick={() => handleSort(col)}
                                className={colIndex === 0 ? "sticky-column" : ""}
                            >
                                {col} {sortConfig.key === col ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <TableRow 
                                key={index}
                                onClick={() => isAdmin && onRowClick && onRowClick(row)}
                                className={isAdmin ? "clickable-row" : ""}
                                hover={isAdmin}
                            >
                                {columns.map((col, colIndex) => (
                                    <TableCell 
                                        key={col} 
                                        className={colIndex === 0 ? "sticky-column" : ""}
                                    >
                                        {row[col] || "-"}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="no-data">No data available</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default FundingTable;
