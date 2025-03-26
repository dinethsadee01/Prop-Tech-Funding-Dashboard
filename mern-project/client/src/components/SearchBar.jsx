import React from "react";
import { Button } from "antd";
import { SearchOutlined  } from "@ant-design/icons";
import "../styles/SearchBar.css";

const SearchBar = ({ query, setQuery, onSearch, toggleAdvancedSearch }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search companies, cities, states..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className="search-buttons">
                <Button onClick={onSearch} type="primary" shape="circle" icon={<SearchOutlined />} size="large" />
                <Button onClick={toggleAdvancedSearch} type="primary" shape="round" icon={<SearchOutlined  />} size="large">
                    Advanced
                </Button>
            </div>
        </div>
    );
};

export default SearchBar;