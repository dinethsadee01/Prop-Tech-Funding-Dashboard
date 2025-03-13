import React, { useState } from "react";

const AdvancedSearch = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        companyName: "",
        city: "",
        state: "",
        fundingRounds: "",
        foundedYear: [1887, 2023],
        yearsActive: [0, 200],
        numberOfFounders: "",
        totalFunding: [0, 500000000],
    });

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSearch(filters);
    };

    return (
        <div className="advanced-search">
            <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} />
            <input type="text" name="city" placeholder="City" onChange={handleChange} />
            <input type="text" name="state" placeholder="State" onChange={handleChange} />

            <select name="fundingRounds" onChange={handleChange}>
                <option value="">Funding Rounds</option>
                {[...Array(10).keys()].map((num) => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>

            <button onClick={handleSubmit}>Apply Filters</button>
        </div>
    );
};

export default AdvancedSearch;