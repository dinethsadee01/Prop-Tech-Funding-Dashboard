import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import "../styles/FundingTable.css";
import { columnNames } from '../../../shared/config/column.config';

const FundingTable = ({ data, onSort, sortConfig, onRowClick, isAdmin = false }) => {
    // Remove local sorting logic and use parent's sortConfig
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        onSort(key, direction);
    };

    const columns = columnNames;

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
