import React, { useState, useEffect } from "react";
import axios from "axios";
import AdvancedSearch from "../components/AdvancedSearch";
import FundingTable from "../components/FundingTable";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [advancedFilters, setAdvancedFilters] = useState({});
    const [fundingData, setFundingData] = useState([]);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    // Fetch all funding data on page load
    useEffect(() => {
        fetchFundingData();
    }, []);

    const fetchFundingData = async (filters = {}) => {
        try {
            const response = await axios.get("/api/funding/search", { params: filters });
            setFundingData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Handle normal search
    const handleSearch = () => {
        fetchFundingData({ query: searchQuery });
    };

    // Handle advanced search
    const handleAdvancedSearch = (filters) => {
        setAdvancedFilters(filters);
        fetchFundingData(filters);
    };

    // Handle export
    const handleExport = async () => {
        try {
            const response = await axios.get("/api/funding/export", {
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
                <FundingTable data={fundingData} />
            </div>
        </div>
    );
};

export default Dashboard;