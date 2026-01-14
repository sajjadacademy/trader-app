const STORAGE_KEY = 'simulation_trades';
const USERS_KEY = 'simulation_users';

export const simulationBridge = {
    // --- TRADES MANAGEMENT ---
    getTrades: () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Bridge Get Error", e);
            return [];
        }
    },

    saveTrades: (trades) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
        window.dispatchEvent(new Event('storage_update'));
    },

    addTrade: (trade) => {
        const trades = simulationBridge.getTrades();
        trades.unshift(trade);
        simulationBridge.saveTrades(trades);
    },

    updateTrade: (id, updates) => {
        const trades = simulationBridge.getTrades();
        const index = trades.findIndex(t => String(t.id) === String(id));
        if (index !== -1) {
            trades[index] = { ...trades[index], ...updates };
            simulationBridge.saveTrades(trades);
            return true;
        }
        return false;
    },

    closeTrade: (id, closeInfo) => {
        const trades = simulationBridge.getTrades();
        const index = trades.findIndex(t => String(t.id) === String(id));
        if (index !== -1) {
            trades[index] = {
                ...trades[index],
                ...closeInfo,
                status: 'CLOSED',
                close_time: new Date().toISOString()
            };
            simulationBridge.saveTrades(trades);

            // Also update the User Balance associated with this trade?
            // Since we are mocking, we can assume single user or try to match User ID
            // Ideally we pass userId with trade
        }
    },

    // --- USER MANAGEMENT ---
    getUsers: () => {
        try {
            const raw = localStorage.getItem(USERS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    saveUsers: (users) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        window.dispatchEvent(new Event('user_storage_update'));
    },

    createUser: (username, password, balance = 10000.00, isAdmin = false, full_name = '', broker = 'MetaQuotes-Demo', account_type = 'demo') => {
        const cleanUser = username.trim();
        const cleanPass = password.trim();

        const users = simulationBridge.getUsers();
        if (users.find(u => u.username === cleanUser)) {
            throw new Error("User already exists");
        }
        const newUser = {
            id: Date.now(),
            username: cleanUser,
            password: cleanPass,
            balance: parseFloat(balance),
            isAdmin,
            full_name: full_name || cleanUser,
            broker: broker,
            account_type: account_type,
            account_login: Math.floor(100000000 + Math.random() * 900000000).toString(),
            created_at: new Date().toISOString()
        };
        users.push(newUser);
        simulationBridge.saveUsers(users);
        return newUser;
    },

    login: (username, password) => {
        const cleanUser = username.trim();
        const cleanPass = password.trim();

        const users = simulationBridge.getUsers();
        const user = users.find(u => u.username === cleanUser && u.password === cleanPass);
        if (user) return user;
        throw new Error("Invalid credentials");
    },

    getUser: (username) => {
        const cleanUser = username.trim();
        const users = simulationBridge.getUsers();
        return users.find(u => u.username === cleanUser);
    },

    updateUserBalance: (username, amountToAdd) => {
        const cleanUser = username.trim();
        const users = simulationBridge.getUsers();
        const index = users.findIndex(u => u.username === cleanUser);
        if (index !== -1) {
            users[index].balance += amountToAdd;
            simulationBridge.saveUsers(users);
            return users[index].balance;
        }
        return null;
    },

    setBalance: (username, newBalance) => {
        const cleanUser = username.trim();
        const users = simulationBridge.getUsers();
        const index = users.findIndex(u => u.username === cleanUser);
        if (index !== -1) {
            users[index].balance = parseFloat(newBalance);
            simulationBridge.saveUsers(users);
        }
    },

    deleteUser: (username) => {
        const cleanUser = username.trim();
        let users = simulationBridge.getUsers();
        const initialLength = users.length;
        users = users.filter(u => u.username !== cleanUser);

        if (users.length < initialLength) {
            simulationBridge.saveUsers(users);
            return true;
        }
        return false;
    },

    updateUser: (username, updates) => {
        const cleanUser = username.trim();
        const users = simulationBridge.getUsers();
        const index = users.findIndex(u => u.username === cleanUser);

        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            simulationBridge.saveUsers(users);
            return true;
        }
        return false;
    }
};
