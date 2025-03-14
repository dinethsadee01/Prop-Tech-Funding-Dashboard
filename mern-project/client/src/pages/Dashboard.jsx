import React, { useState, useEffect } from "react";
import axios from "axios";
import AdvancedSearch from "../components/AdvancedSearch";
import FundingTable from "../components/FundingTable";
import "../styles/Dashboard.css";
import "../styles/FundingTable.css";
import "../styles/AdvancedSearch.css";

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [advancedFilters, setAdvancedFilters] = useState({});
    const [fundingData, setFundingData] = useState([]);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 25; // Number of records per page

    useEffect(() => {
        fetchFundingData();
    }, [currentPage]); // Refetch when page changes

    const fetchFundingData = async (filters = {}) => {
        try {
            const response = await axios.get("/api/funding-data/search", {
                params: { ...filters, query: searchQuery, page: currentPage, limit: recordsPerPage },
            });
            setFundingData(response.data.records);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page
        fetchFundingData({ query: searchQuery });
    };

    const handleAdvancedSearch = (filters) => {
        setAdvancedFilters(filters);
        setCurrentPage(1); // Reset to first page
        fetchFundingData(filters);
    };

    const handleExport = async () => {
        try {
            const response = await axios.get("/api/funding-data/export", {
                params: { ...advancedFilters, query: searchQuery },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "exported_data.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error exporting CSV:", error);
        }
    };

    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const startRecord = (currentPage - 1) * recordsPerPage + 1;
    const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

    return (
        <div className="dashboard">
            {/* Top Navigation */}
            <div className="top-nav">
                <button className="admin-button">Admin?</button>
            </div>

            {/* Normal Search */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name, city, state..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}>Advanced Search</button>
            </div>

            {/* Advanced Search Panel */}
            {isAdvancedOpen && <AdvancedSearch onSearch={handleAdvancedSearch} />}

            {/* Table & Export Button */}
            <div className="table-container">
                <button className="export-btn" onClick={handleExport}>Export CSV</button>
                <p className="record-info">{startRecord}-{endRecord} of {totalRecords} records</p>
                <FundingTable data={fundingData} />

                {/* Pagination Controls */}
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
