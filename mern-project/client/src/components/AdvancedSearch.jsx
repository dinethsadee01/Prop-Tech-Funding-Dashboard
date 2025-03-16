import React, { useState, useEffect } from "react";
import { Range } from "react-range";
import "../styles/AdvancedSearch.css";

const AdvancedSearch = ({ onSearch }) => {
    const defaultFilters = {
        name: "",
        city: "",
        state: "",
        fundingRounds: "",
        foundedYear: [1887, 2025],
        yearsActive: [0, 200],
        numberOfFounders: "",
        totalFunding: [0, 100000000], // Default range
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

    // Handle range sliders
    const handleSliderChange = (name, values) => {
        setFilters({ ...filters, [name]: values });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    // Reset filters
    const handleClearFilters = () => {
        setFilters(defaultFilters);
        onSearch(defaultFilters);
    };

    return (
        <div className="advanced-search">
            <h3>Advanced Search</h3>
            <form onSubmit={handleSubmit}>
                {/* Text Inputs */}
                <div className="input-group">
                    <input type="text" name="name" placeholder="Company Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
                    <input type="text" name="city" placeholder="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
                    <input type="text" name="state" placeholder="State" value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })} />
                </div>

                {/* Sliders with Dual Pointers */}
                <div className="slider-group">
                    {/* Founded Year Slider */}
                    <label>Founded Year: {filters.foundedYear[0]} - {filters.foundedYear[1]}</label>
                    <Range
                        step={1}
                        min={1887}
                        max={2025}
                        values={filters.foundedYear}
                        onChange={(values) => handleSliderChange("foundedYear", values)}
                        renderTrack={({ props, children }) => (
                            <div {...props} style={{
                                ...props.style, height: "6px", width: "25%", marginLeft: "10px",
                                background: `linear-gradient(to right, #ccc ${((filters.foundedYear[0] - 1887) / (2023 - 1887)) * 100}%, 
                                              #007bff ${((filters.foundedYear[0] - 1887) / (2023 - 1887)) * 100}%, 
                                              #007bff ${((filters.foundedYear[1] - 1887) / (2023 - 1887)) * 100}%, 
                                              #ccc ${((filters.foundedYear[1] - 1887) / (2023 - 1887)) * 100}%)`
                            }}>
                                {children}
                            </div>
                        )}
                        renderThumb={({ props }) => (
                            <div {...props} style={{ ...props.style, height: "16px", width: "16px", backgroundColor: "#007bff", borderRadius: "50%" }} />
                        )}
                    />

                    {/* Years Active Slider */}
                    <label>Years Active: {filters.yearsActive[0]} - {filters.yearsActive[1]}</label>
                    <Range
                        step={1}
                        min={0}
                        max={200}
                        values={filters.yearsActive}
                        onChange={(values) => handleSliderChange("yearsActive", values)}
                        renderTrack={({ props, children }) => (
                            <div {...props} style={{
                                ...props.style, height: "6px", width: "25%", marginLeft: "10px",
                                background: `linear-gradient(to right, #ccc ${((filters.yearsActive[0] - 0) / (200 - 0)) * 100}%, 
                                              #007bff ${((filters.yearsActive[0] - 0) / (200 - 0)) * 100}%, 
                                              #007bff ${((filters.yearsActive[1] - 0) / (200 - 0)) * 100}%, 
                                              #ccc ${((filters.yearsActive[1] - 0) / (200 - 0)) * 100}%)`
                            }}>
                                {children}
                            </div>
                        )}
                        renderThumb={({ props }) => (
                            <div {...props} style={{ ...props.style, height: "16px", width: "16px", backgroundColor: "#007bff", borderRadius: "50%" }} />
                        )}
                    />

                    {/* Total Funding Slider */}
                    <label>Total Funding: ${filters.totalFunding[0].toLocaleString()} - ${filters.totalFunding[1].toLocaleString()}</label>
                    <Range
                        step={1000000}
                        min={0}
                        max={100000000}
                        values={filters.totalFunding}
                        onChange={(values) => handleSliderChange("totalFunding", values)}
                        renderTrack={({ props, children }) => (
                            <div {...props} style={{
                                ...props.style, height: "6px", width: "25%", marginLeft: "10px",
                                background: `linear-gradient(to right, #ccc ${((filters.totalFunding[0] - 0) / (100000000 - 0)) * 100}%, 
                                              #007bff ${((filters.totalFunding[0] - 0) / (100000000 - 0)) * 100}%, 
                                              #007bff ${((filters.totalFunding[1] - 0) / (100000000 - 0)) * 100}%, 
                                              #ccc ${((filters.totalFunding[1] - 0) / (100000000 - 0)) * 100}%)`
                            }}>
                                {children}
                            </div>
                        )}
                        renderThumb={({ props }) => (
                            <div {...props} style={{ ...props.style, height: "16px", width: "16px", backgroundColor: "#007bff", borderRadius: "50%" }} />
                        )}
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
