import React, { useState, useEffect } from "react";
import {Pagination, Stack} from '@mui/material/';
import { useNavigate } from "react-router-dom";
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import SearchBar from "../components/SearchBar";
import AdvancedSearch from "../components/AdvancedSearch";
import FundingTable from "../components/FundingTable";
import ExportModal from "../components/ExportModal";
import EditorModel from "../components/EditorModel";
import TopNav from "../components/TopNav";
import CreateRecordModal from "../components/CreateRecordModal";
import {fetchFundingData, exportFundingData, searchFundingData, advancedSearchFundingData } from "../services/api";
import "../styles/AdminDash.css";
import { Button } from "antd";

const AdminDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [advancedFilters, setAdvancedFilters] = useState({});
    const [fundingData, setFundingData] = useState([] || []);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [editorVisible, setEditorVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
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

    const handleRowClick = (record) => {
        setSelectedRecord(record);
        setEditorVisible(true);
    };

    const handleEditorClose = () => {
        setEditorVisible(false);
        setSelectedRecord(null);
    };

    const handleCreateRecord = () => {
        setCreateModalVisible(true);
    };

    const handleCreateModalClose = () => {
        setCreateModalVisible(false);
    };

    const refreshData = async () => {
        try {
            // Reload data after update or delete
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
            console.error("Error refreshing data:", error);
        }
    };

    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const startRecord = (currentPage - 1) * recordsPerPage + 1;
    const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

    return (
        <div className="adDashboard">
            {/* Top Navigation */}
            <TopNav adminButtonText="Log Out" onAdminClick={() => navigate("/")} />

            {/* Normal Search and Export */}
            <div className="adSearch-panel">
                <SearchBar
                    query={searchQuery}
                    setQuery={setSearchQuery}
                    onSearch={handleSearch}
                    toggleAdvancedSearch={() => setIsAdvancedOpen(!isAdvancedOpen)}
                />
                <Button className="adCreate-btn" onClick={handleCreateRecord} type="primary" shape="circle" icon={<PlusOutlined />} size="large" />
                <Button className="adExport-btn" onClick={handleExportClick} type="primary" shape="circle" icon={<DownloadOutlined/>} size="large" />
                {/* Export Confirmation Modal */}
                <ExportModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleExportConfirm}
                />
                {/* Create Record Modal */}
                <CreateRecordModal
                    visible={createModalVisible}
                    onClose={handleCreateModalClose}
                    onRecordUpdate={refreshData}
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
                    onRowClick={handleRowClick}
                    isAdmin={true}
                />

                {/* Editor Modal */}
                <EditorModel 
                    record={selectedRecord}
                    visible={editorVisible}
                    onClose={handleEditorClose}
                    onRecordUpdate={refreshData}
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
