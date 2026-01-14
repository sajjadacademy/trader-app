// IMPORTANT: For Android Emulator use 'http://10.0.2.2:8000'
// For Physical Device use your PC's Local IP, e.g., 'http://192.168.1.X:8000'
// For Web (Browser) 'http://localhost:8000' works fine.

// CHANGE THIS IP ADDRESS TO CONNECT FROM MOBILE
// CHANGE THIS IP ADDRESS TO CONNECT FROM MOBILE
const BASE_DOMAIN = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_URL = BASE_DOMAIN;
const SOCKET_URL = BASE_DOMAIN.replace('https', 'wss').replace('http', 'ws');

const fetchWithTimeout = async (resource, options = {}) => {
    const { timeout = 10000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

export const api = {
    // Auth
    register: async (userData) => {
        const response = await fetchWithTimeout(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const text = await response.text();
            console.error("Registration Error Response:", text);
            try {
                const error = JSON.parse(text);
                throw new Error(error.detail || 'Registration failed: ' + JSON.stringify(error));
            } catch (e) {
                if (e.message.includes("Registration failed")) throw e;
                throw new Error('Registration failed: ' + text);
            }
        }
        return response.json();
    },

    login: async (username, password) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetchWithTimeout(`${API_URL}/auth/token`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Login failed');
            }
            return response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error("Connection timed out. Check internet or server status.");
            }
            throw error;
        }
    },

    // User Data
    getMe: async (token) => {
        const response = await fetchWithTimeout(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    // Trades (User)
    getTrades: async (token) => {
        const response = await fetchWithTimeout(`${API_URL}/trades/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    placeTrade: async (token, tradeData) => {
        const response = await fetchWithTimeout(`${API_URL}/trades/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tradeData)
        });
        return response.json();
    },

    // Admin
    getAllTrades: async (token) => {
        const response = await fetchWithTimeout(`${API_URL}/admin/trades`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    forceOutcome: async (token, tradeId, outcome) => {
        const response = await fetchWithTimeout(`${API_URL}/admin/trades/${tradeId}/outcome?outcome=${outcome}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    closeTrade: async (token, tradeId, price) => {
        const response = await fetchWithTimeout(`${API_URL}/trades/${tradeId}/close?close_price=${price}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    settleTrade: async (token, tradeId, amount, outcome) => {
        const response = await fetchWithTimeout(`${API_URL}/admin/trades/${tradeId}/settle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount, outcome })
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Settlement failed");
        }
        return response.json();
    }
};
