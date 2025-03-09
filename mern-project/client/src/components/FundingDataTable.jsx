import React, { useEffect, useState } from "react";
import axios from "axios";

const FundingDataTable = () => {
    const [fundingData, setFundingData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/funding-data");
                setFundingData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Funding Data</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Funding Amount</th>
                        <th>Funding Round</th>
                        <th>Investor</th>
                    </tr>
                </thead>
                <tbody>
                    {fundingData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.company_name || "N/A"}</td>
                            <td>{item.total_funding || "N/A"}</td>
                            <td>{item.funding_round || "N/A"}</td>
                            <td>{item.investor || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FundingDataTable;
