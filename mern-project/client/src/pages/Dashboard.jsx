import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import AdvancedSearch from "../components/AdvancedSearch";
import FundingTable from "../components/FundingTable";
import ExportModal from "../components/ExportModal";
import "../styles/Dashboard.css";
import "../styles/FundingTable.css";
import "../styles/AdvancedSearch.css";

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [advancedFilters, setAdvancedFilters] = useState({});
    const [fundingData, setFundingData] = useState([] || []);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const recordsPerPage = 25; // Number of records per page

    useEffect(() => {
        fetchFundingData();
    }, [currentPage]); // Refetch when page changes

    const fetchFundingData = async (filters = {}) => {
        try {
            const response = await axios.get("/api/funding-data/", {
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

    const handleExportClick = () => {
        setIsModalOpen(true); // Show modal when export button is clicked
    };

    const handleExportConfirm = () => {
        setIsModalOpen(false);
        handleExport();
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
                <h1 className="dashboard-title">PropTech Funding Dashboard</h1>
                <button className="admin-button">Admin?</button>
            </div>

            {/* Normal Search and Export */}
            <div className="search-panel">
                <SearchBar
                    query={searchQuery}
                    setQuery={setSearchQuery}
                    onSearch={handleSearch}
                    toggleAdvancedSearch={() => setIsAdvancedOpen(!isAdvancedOpen)}
                />
                <button className="export-btn" onClick={handleExportClick}>Export Data CSV</button>
                {/* Export Confirmation Modal */}
                <ExportModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleExportConfirm}
                />
            </div>

            {/* Advanced Search Panel */}
            {isAdvancedOpen && <AdvancedSearch onSearch={handleAdvancedSearch} />}

            {/* Table Buttons */}
            <div className="table-container">
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
