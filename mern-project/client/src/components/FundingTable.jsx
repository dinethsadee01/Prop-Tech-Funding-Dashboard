import React, { useState } from "react";
import "../styles/FundingTable.css";

const FundingTable = ({ data }) => {
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortField) return 0;
        const valA = a[sortField];
        const valB = b[sortField];
        return sortOrder === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    return (
        <table className="funding-table">
            <thead>
                <tr>
                    <th onClick={() => handleSort("name")}>Company Name</th>
                    <th onClick={() => handleSort("city")}>City</th>
                    <th onClick={() => handleSort("state")}>State</th>
                    <th onClick={() => handleSort("fundingRounds")}>Funding Rounds</th>
                </tr>
            </thead>
            <tbody>
                {sortedData.map((item) => (
                    <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.city}</td>
                        <td>{item.state}</td>
                        <td>{item.fundingRounds}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default FundingTable;