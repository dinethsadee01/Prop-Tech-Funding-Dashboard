import React, { useState, useEffect } from "react";
import {Pagination, Stack} from '@mui/material/';
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import AdvancedSearch from "../components/AdvancedSearch";
import FundingTable from "../components/FundingTable";
import ExportModal from "../components/ExportModal";
import {fetchFundingData, exportFundingData, searchFundingData, advancedSearchFundingData } from "../services/api";
import "../styles/AdminDash.css";
import logo from "../assets/logo.svg";

const AdminDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [advancedFilters, setAdvancedFilters] = useState({});
    const [fundingData, setFundingData] = useState([] || []);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const navigate = useNavigate();
    const recordsPerPage = 10; // Number of records per page

    useEffect(() => {
        const loadData = async () => {
            try {
                // If we have active search or filters, apply them with pagination
                if (searchQuery) {
                    const data = await searchFundingData(searchQuery, currentPage, recordsPerPage, sortConfig.key, sortConfig.direction);
                    setFundingData(data.records);
                    setTotalRecords(data.total);
                } else if (Object.keys(advancedFilters).length > 0) {
                    const payload = {
                        name: advancedFilters.name,
                        city: advancedFilters.city,
                        state: advancedFilters.state,
                        minFunding: advancedFilters.totalFunding?.[0],
                        maxFunding: advancedFilters.totalFunding?.[1],
                        fundingRounds: advancedFilters.fundingRounds,
                        minYear: advancedFilters.foundedYear?.[0],
                        maxYear: advancedFilters.foundedYear?.[1],
                        minYearsActive: advancedFilters.yearsActive?.[0],
                        maxYearsActive: advancedFilters.yearsActive?.[1],
                        minFounders: advancedFilters.numberOfFounders[0],
                        maxFounders: advancedFilters.numberOfFounders[1]
                    };
                    const data = await advancedSearchFundingData(payload, currentPage, recordsPerPage, sortConfig.key, sortConfig.direction);
                    setFundingData(data.records);
                    setTotalRecords(data.total);
                } else {
                    // Default data load with pagination and sorting
                    const res = await fetchFundingData({ 
                        page: currentPage, 
                        limit: recordsPerPage,
                        sortBy: sortConfig.key,
                        sortDirection: sortConfig.direction
                    });
                    setFundingData(res.records);
                    setTotalRecords(res.total);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        
        loadData();
    }, [currentPage, searchQuery, advancedFilters, sortConfig]);

    const handleSearch = async () => {
        setCurrentPage(1); // Reset to first page
        const data = await searchFundingData(searchQuery, 1, recordsPerPage);
        setFundingData(data.records);
        setTotalRecords(data.total);
    };

    const handleAdvancedSearch = async (filters) => {
        setAdvancedFilters(filters);
        setCurrentPage(1); // Reset to first page
        // const payload = {
        //     name: filters.name,
        //     city: filters.city,
        //     state: filters.state,
        //     minFunding: filters.totalFunding[0],
        //     maxFunding: filters.totalFunding[1],
        //     fundingRounds: filters.fundingRounds,
        //     minYear: filters.foundedYear[0],
        //     maxYear: filters.foundedYear[1],
        //     minYearsActive: filters.yearsActive[0],
        //     maxYearsActive: filters.yearsActive[1],
        //     minFounders: filters.numberOfFounders[0],
        //     maxFounders: filters.numberOfFounders[1]
        // };
        // const data = await advancedSearchFundingData(payload, 1, recordsPerPage);
        // setFundingData(data.records);
        // setTotalRecords(data.total);
    };

    const handleExportClick = () => {
        setIsModalOpen(true); // Show modal when export button is clicked
    };

    const handleExportConfirm = () => {
        setIsModalOpen(false);
        exportFundingData({ ...advancedFilters, query: searchQuery });
    };

    const handleSort = (key, direction) => {
        setSortConfig({ key, direction });
    };

    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const startRecord = (currentPage - 1) * recordsPerPage + 1;
    const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

    return (
        <div className="adDashboard">
            {/* Top Navigation */}
            <div className="adTop-nav">
                <img src={logo} alt="logo" className="adLogo" onClick={() => window.open("https://www.proptechangelgroup.com/", "_blank")} />
                <h1 className="adDashboard-title">Funding Dashboard</h1>
                <button className="adAdmin-button" onClick={() => navigate("/admin")}>Admin?</button>
            </div>

            {/* Normal Search and Export */}
            <div className="adSearch-panel">
                <SearchBar
                    query={searchQuery}
                    setQuery={setSearchQuery}
                    onSearch={handleSearch}
                    toggleAdvancedSearch={() => setIsAdvancedOpen(!isAdvancedOpen)}
                />
                <button className="adExport-btn" onClick={handleExportClick}>Export Data CSV</button>
                {/* Export Confirmation Modal */}
                <ExportModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleExportConfirm}
                />
            </div>

            {/* Advanced Search Panel */}
            {isAdvancedOpen && <AdvancedSearch onSearch={handleAdvancedSearch} />}

            {/* Table */}
            <div className="adTable-container">
                <p className="adRecord-info">{totalRecords > 0 ? `${startRecord}-${endRecord} of ${totalRecords} Records` : "No records found"}</p>
                <FundingTable 
                    data={fundingData} 
                    onSort={handleSort}
                    sortConfig={sortConfig}
                />

                {/* Pagination Controls */}
                <Stack spacing={2} sx={{ 
                    marginTop: "1rem", 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Pagination color="primary" count={totalPages} page={currentPage} onChange={(e, page) => setCurrentPage(page)} />
                </Stack>
            </div>
        </div>
    );
};

export default AdminDashboard;
