import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add auth token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Authentication API methods
export const registerUser = async (userData) => {
    try {
        const response = await api.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post("/auth/login", credentials);
        // Store token in localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

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
export const searchFundingData = async (query, page = 1, limit = 25, sortBy = null, sortDirection = 'asc') => {
    try {
        const response = await api.get("/funding-data/search", { 
            params: { query, page, limit, sortBy, sortDirection } 
        });
        console.log("Search query done", response.data); // ✅ Debugging
        return response.data;
    } catch (error) {
        console.error("Error searching funding data:", error);
        throw error;
    }
};

// Advanced search
export const advancedSearchFundingData = async (filters, page = 1, limit = 25, sortBy = null, sortDirection = 'asc') => {
    try {
        const response = await api.get("/funding-data/adv-search", { 
            params: { 
                ...filters, 
                page, 
                limit,
                sortBy,
                sortDirection
            } 
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

// Get funding data by ID
export const getFundingRecordById = async (id) => {
    try {
        const response = await api.get(`/funding-data/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching record by ID:", error);
        throw error;
    }
};

// Create new funding record
export const createFundingRecord = async (data) => {
    try {
        const response = await api.post('/funding-data', data,{headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating funding record:", error);
        throw error;
    }
};

// Update funding record
export const updateFundingRecord = async (id, data) => {
    try {
        const response = await api.put(`/funding-data/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating funding record:", error);
        throw error;
    }
};

// Delete funding record
export const deleteFundingRecord = async (id) => {
    try {
        const response = await api.delete(`/funding-data/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting funding record:", error);
        throw error;
    }
};

export default api;