import { useEffect, useState } from "react";
import { fetchFundingData } from "../services/api";

const Dashboard = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchFundingData()
            .then((funding) => setData(funding))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1>Funding Dashboard</h1>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>
                        {item.company} - {item.funding} ({item.round})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
