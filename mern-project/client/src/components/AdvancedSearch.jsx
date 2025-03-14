import React, { useState, useEffect } from "react";
import "../styles/AdvancedSearch.css";

const AdvancedSearch = ({ onSearch }) => {
    const defaultFilters = {
        name: "",
        city: "",
        state: "",
        fundingRounds: "",
        foundedYear: [1887, 2023],
        yearsActive: [0, 200],
        numberOfFounders: "",
        totalFunding: [0, 1000000000], // Default range
    };

    const [filters, setFilters] = useState(defaultFilters);

    // Fetch max funding value dynamically
    useEffect(() => {
        fetch("/api/funding-data/max-funding")
            .then((res) => res.json())
            .then((data) => {
                if (data.maxFunding) {
                    setFilters((prev) => ({ ...prev, totalFunding: [0, data.maxFunding] }));
                }
            })
            .catch((err) => console.error("Error fetching max funding:", err));
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Handle dropdown selections
    const handleDropdownChange = (e) => {
        const value = e.target.value === "N/A" ? "0" : e.target.value; // Treat "N/A" as 0
        setFilters({ ...filters, [e.target.name]: value });
    };

    // Handle slider adjustments
    const handleSliderChange = (name, value, index) => {
        const updatedRange = [...filters[name]];
        updatedRange[index] = value;

        // Ensure min <= max
        if (updatedRange[0] > updatedRange[1]) return;

        setFilters({ ...filters, [name]: updatedRange });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    // Reset filters
    const handleClearFilters = () => {
        setFilters(defaultFilters);
        onSearch(defaultFilters); // Immediately reset search results
    };

    return (
        <div className="advanced-search">
            <h3>Advanced Search</h3>
            <form onSubmit={handleSubmit}>
                {/* Text Inputs */}
                <div className="input-group">
                    <input type="text" name="name" placeholder="Company Name" value={filters.name} onChange={handleChange} />
                    <input type="text" name="city" placeholder="City" value={filters.city} onChange={handleChange} />
                    <input type="text" name="state" placeholder="State" value={filters.state} onChange={handleChange} />
                </div>

                {/* Dropdowns */}
                <div className="input-group">
                    <label>Funding Rounds:</label>
                    <select name="fundingRounds" value={filters.fundingRounds} onChange={handleDropdownChange}>
                        <option value="">Any</option>
                        {Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                        <option value="N/A">N/A</option>
                    </select>

                    <label>Number of Founders:</label>
                    <select name="numberOfFounders" value={filters.numberOfFounders} onChange={handleDropdownChange}>
                        <option value="">Any</option>
                        {Array.from({ length: 21 }, (_, i) => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                        <option value="N/A">N/A</option>
                    </select>
                </div>

                {/* Sliders */}
                <div className="slider-group">
                    <label>Founded Year: {filters.foundedYear[0]} - {filters.foundedYear[1]}</label>
                    <input type="range" min="1887" max="2023" step="1"
                        value={filters.foundedYear[0]}
                        onChange={(e) => handleSliderChange("foundedYear", Number(e.target.value), 0)}
                    />
                    <input type="range" min="1887" max="2023" step="1"
                        value={filters.foundedYear[1]}
                        onChange={(e) => handleSliderChange("foundedYear", Number(e.target.value), 1)}
                    />

                    <label>Years Active: {filters.yearsActive[0]} - {filters.yearsActive[1]}</label>
                    <input type="range" min="0" max="200" step="1"
                        value={filters.yearsActive[0]}
                        onChange={(e) => handleSliderChange("yearsActive", Number(e.target.value), 0)}
                    />
                    <input type="range" min="0" max="200" step="1"
                        value={filters.yearsActive[1]}
                        onChange={(e) => handleSliderChange("yearsActive", Number(e.target.value), 1)}
                    />

                    <label>Total Funding: ${filters.totalFunding[0].toLocaleString()} - ${filters.totalFunding[1].toLocaleString()}</label>
                    <input type="range" min="0" max={filters.totalFunding[1]} step="1000000"
                        value={filters.totalFunding[0]}
                        onChange={(e) => handleSliderChange("totalFunding", Number(e.target.value), 0)}
                    />
                    <input type="range" min="0" max={filters.totalFunding[1]} step="1000000"
                        value={filters.totalFunding[1]}
                        onChange={(e) => handleSliderChange("totalFunding", Number(e.target.value), 1)}
                    />
                </div>

                {/* Buttons */}
                <div className="button-group">
                    <button type="submit">Search</button>
                    <button type="button" onClick={handleClearFilters} className="clear-button">Clear Filters</button>
                </div>
            </form>
        </div>
    );
};

export default AdvancedSearch;