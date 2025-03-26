import React, { useState, useEffect } from "react";
import {Pagination, Stack} from '@mui/material/';
import { MenuFoldOutlined,MenuUnfoldOutlined,UploadOutlined,UserOutlined,VideoCameraOutlined} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import AdvancedSearch from "../components/AdvancedSearch";
import FundingTable from "../components/FundingTable";
import ExportModal from "../components/ExportModal";
import {fetchFundingData, exportFundingData, searchFundingData, advancedSearchFundingData } from "../services/api";
import "../styles/AdminDashboard.css";
import "../styles/FundingTable.css";
import "../styles/AdvancedSearch.css";

const { Header, Sider, Content } = Layout;

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
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

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
        <Layout className="dashboard">
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'All Data',
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'Company Info',
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'Funding Data',
                        },
                        {
                            key: '4',
                            icon: <UserOutlined />,
                            label: 'Rankings',
                        },
                        {
                            key: '5',
                            icon: <MenuFoldOutlined />,
                            label: 'Profile',
                        }
                    ]}
                />
            </Sider>
            <Layout>
                <Header className="top-nav" style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                        }}
                    />
                    <h1 className="dashboard-title">PropTech Funding Dashboard</h1>
                    <button className="admin-button" onClick={() => navigate("/admin")}>Admin?</button>
                </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
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
                        <p className="record-info">{totalRecords > 0 ? `${startRecord}-${endRecord} of ${totalRecords} Records` : "No records found"}</p>
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
                    </Content>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard;
