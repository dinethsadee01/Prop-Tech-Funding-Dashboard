import { useState } from "react";

const SearchBar = ({ onSearch, toggleAdvancedSearch }) => {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search companies, cities, states..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>🔍 Search</button>
            <button onClick={toggleAdvancedSearch}>Advanced Search</button>
        </div>
    );
};

export default SearchBar;