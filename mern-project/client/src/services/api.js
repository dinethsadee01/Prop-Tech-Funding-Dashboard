import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Backend URL

// Create an Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Fetch funding data
export const fetchFundingData = async () => {
    try {
        const response = await api.get("/funding-data");
        return response.data;
    } catch (error) {
        console.error("Error fetching funding data:", error);
        throw error;
    }
};

export default api;
