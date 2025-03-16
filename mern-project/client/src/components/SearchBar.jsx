import React from "react";
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
                <button onClick={onSearch}>🔍 Search</button>
                <button onClick={toggleAdvancedSearch}>Advanced Search</button>
            </div>
        </div>
    );
};

export default SearchBar;