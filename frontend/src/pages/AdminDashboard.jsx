import React, { useState, useEffect } from 'react';
import { simulationBridge } from '../utils/simulationBridge';

const AdminDashboard = ({ onClose }) => {
    // TABS: 'trades' or 'users'
    const [activeTab, setActiveTab] = useState('trades');

    // TRADES STATE
    const [trades, setTrades] = useState([]);
    const [tradeEditValues, setTradeEditValues] = useState({});

    // USERS STATE
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', balance: 10000 });
    const [balanceEditValues, setBalanceEditValues] = useState({});

    // SYNC
    const loadData = () => {
        setTrades(simulationBridge.getTrades());
        setUsers(simulationBridge.getUsers());
    };

    useEffect(() => {
        loadData();
        const handleUpdate = () => loadData();
        window.addEventListener('storage', handleUpdate);
        window.addEventListener('storage_update', handleUpdate);
        window.addEventListener('user_storage_update', handleUpdate);

        const interval = setInterval(loadData, 1000); // Polling backup

        return () => {
            window.removeEventListener('storage', handleUpdate);
            window.removeEventListener('storage_update', handleUpdate);
            window.removeEventListener('user_storage_update', handleUpdate);
            clearInterval(interval);
        };
    }, []);

    // --- TRADE HANDLERS ---
    const handleSetProfit = (tradeId) => {
        const val = tradeEditValues[tradeId];
        if (val === undefined || val === '') return;
        const targetProfit = parseFloat(val);
        simulationBridge.updateTrade(tradeId, {
            targetProfit,
            forced_outcome: targetProfit >= 0 ? 'WIN' : 'LOSS'
        });
        alert(`Profit set to ${targetProfit} for Trade #${tradeId}`);
        loadData();
    };

    // --- USER HANDLERS ---
    const handleCreateUser = (e) => {
        e.preventDefault();
        try {
            simulationBridge.createUser(newUser.username, newUser.password, newUser.balance);
            alert("User created! Pass credentials to user.");
            setNewUser({ username: '', password: '', balance: 10000 });
            loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateBalance = (username) => {
        const val = balanceEditValues[username];
        if (!val) return;
        simulationBridge.setBalance(username, val);
        alert(`Balance updated for ${username}`);
        loadData();
    };

    const openTrades = trades.filter(t => t.status === 'OPEN');

    return (
        <div className="p-8 relative bg-gray-900 min-h-screen text-white font-sans">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-white">✕</button>
            <h1 className="text-2xl font-bold mb-6">Admin Control Panel</h1>

            {/* TABS */}
            <div className="flex space-x-4 mb-6 border-b border-gray-700 pb-2">
                <button
                    onClick={() => setActiveTab('trades')}
                    className={`text-sm font-bold pb-2 ${activeTab === 'trades' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
                >
                    LIVE TRADES
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`text-sm font-bold pb-2 ${activeTab === 'users' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
                >
                    USER MANAGEMENT
                </button>
            </div>

            {/* TRADES VIEW */}
            {activeTab === 'trades' && (
                <div className="bg-gray-800 rounded shadow p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Live Trades Manager</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-700 text-gray-300">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Symbol</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Est. Profit</th>
                                    <th className="p-3">Current Price</th>
                                    <th className="p-3 text-center">Set Target Profit ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {openTrades.length === 0 && <tr><td colSpan="6" className="p-4 text-center text-gray-500">No active trades found.</td></tr>}
                                {openTrades.map(t => (
                                    <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-750">
                                        <td className="p-3 text-gray-400">#{t.id}</td>
                                        <td className="p-3 font-bold">{t.symbol}</td>
                                        <td className={`p-3 uppercase font-bold ${t.type === 'buy' ? 'text-blue-400' : 'text-red-400'}`}>{t.type} {t.volume}</td>
                                        <td className={`p-3 font-bold ${t.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{t.profit?.toFixed(2)}</td>
                                        <td className="p-3 text-gray-300">{t.currentPrice?.toFixed(5)}</td>
                                        <td className="p-3">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    className="bg-gray-700 text-white px-3 py-1 rounded w-28 focus:outline-none"
                                                    onChange={(e) => setTradeEditValues(prev => ({ ...prev, [t.id]: e.target.value }))}
                                                />
                                                <button onClick={() => handleSetProfit(t.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold">SET</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* USERS VIEW */}
            {activeTab === 'users' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Create User */}
                    <div className="bg-gray-800 p-6 rounded shadow h-fit">
                        <h2 className="text-xl font-bold mb-4">Create New User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-xs mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none"
                                    value={newUser.username}
                                    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-xs mb-1">Password</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-xs mb-1">Initial Balance</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none"
                                    value={newUser.balance}
                                    onChange={e => setNewUser({ ...newUser, balance: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-bold">CREATE USER</button>
                        </form>
                    </div>

                    {/* Check Users */}
                    <div className="bg-gray-800 p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Registered Users</h2>
                        <div className="space-y-4">
                            {users.length === 0 && <p className="text-gray-500">No users created yet.</p>}
                            {users.map(u => (
                                <div key={u.id} className="bg-gray-700 p-4 rounded flex flex-col space-y-2">
                                    <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                                        <span className="font-bold text-lg">{u.username}</span>
                                        <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded font-bold">REAL REAL</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Pass: {u.password}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-300">Bal:</span>
                                            <input
                                                type="number"
                                                defaultValue={u.balance}
                                                className="w-24 bg-gray-600 px-2 py-1 rounded text-right"
                                                onBlur={(e) => setBalanceEditValues(prev => ({ ...prev, [u.username]: e.target.value }))}
                                            />
                                            <button
                                                onClick={() => handleUpdateBalance(u.username)}
                                                className="bg-blue-600 text-xs px-2 py-1 rounded"
                                            >
                                                UPDATE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
