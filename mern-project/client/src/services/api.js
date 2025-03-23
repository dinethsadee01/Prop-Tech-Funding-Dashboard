import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Fetch funding data with pagination and filters
export const fetchFundingData = async (params = {}) => {
    try {
        const response = await api.get("/funding-data", { 
            params: {
                ...params,
                page: params.page || 1,
                limit: params.limit || 25
            } 
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching funding data:", error);
        throw error;
    }
};

// Normal search
export const searchFundingData = async (query, page = 1, limit = 25) => {
    try {
        const response = await api.get("/funding-data/search", { 
            params: { query, page, limit } 
        });
        console.log("Search query done", response.data); // ✅ Debugging
        return response.data;
    } catch (error) {
        console.error("Error searching funding data:", error);
        throw error;
    }
};

// Advanced search
export const advancedSearchFundingData = async (filters, page = 1, limit = 25) => {
    try {
        const response = await api.get("/funding-data/adv-search", { 
            params: { ...filters, page, limit } 
        });
        return response.data;
    } catch (error) {
        console.error("Error performing advanced search:", error);
        throw error;
    }
};

// Export data
export const exportFundingData = async (filters) => {
    try {
        const response = await api.get("/funding-data/export", {
            params: filters,
            responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "exported_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error exporting CSV:", error);
        throw error;
    }
};

export default api;