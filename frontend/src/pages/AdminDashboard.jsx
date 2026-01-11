import React, { useState } from 'react';

const AdminDashboard = ({ onClose }) => {
    // Mock Data
    const users = [
        { id: 1, username: 'trader1', balance: 10000.0, profit: 50.0, account_type: 'demo' },
        { id: 2, username: 'student_dev', balance: 500.0, profit: -20.0, account_type: 'real' },
    ];

    const openTrades = [
        { id: 101, user: 'trader1', symbol: 'EURUSD', type: 'buy', volume: 1.0, profit: 50.0 },
        { id: 102, user: 'student_dev', symbol: 'XAUUSD', type: 'sell', volume: 0.1, profit: -5.0 },
    ];

    return (
        <div className="p-8 relative bg-gray-900 min-h-screen text-white">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-white"
            >
                ✕
            </button>
            <h1 className="text-2xl font-bold mb-6">System Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded shadow">
                    <h3 className="text-gray-400 text-sm">Total Users</h3>
                    <p className="text-3xl font-bold">2</p>
                </div>
                <div className="bg-gray-800 p-6 rounded shadow">
                    <h3 className="text-gray-400 text-sm">Active Trades</h3>
                    <p className="text-3xl font-bold">2</p>
                </div>
                <div className="bg-gray-800 p-6 rounded shadow">
                    <h3 className="text-gray-400 text-sm">Total Volume</h3>
                    <p className="text-3xl font-bold">1.10</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {/* User List */}
                <div className="bg-gray-800 rounded shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Users</h2>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-700 text-gray-300">
                            <tr>
                                <th className="p-2">Username</th>
                                <th className="p-2">Balance</th>
                                <th className="p-2">Type</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-gray-700">
                                    <td className="p-2">{u.username}</td>
                                    <td className="p-2">{u.balance}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.account_type === 'real' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                                            {u.account_type === 'real' ? 'REAL' : 'DEMO'}
                                        </span>
                                    </td>
                                    <td className="p-2 flex space-x-2">
                                        <button className="text-blue-400 hover:underline">Edit</button>
                                        <button
                                            // Mock toggle logic for now - in real app this calls API
                                            onClick={() => {
                                                // In a real app we'd call API. For now we just console log
                                                console.log("Toggle type for", u.username);
                                            }}
                                            className="text-xs border border-gray-500 px-2 py-1 rounded hover:bg-gray-700"
                                        >
                                            Switch to {u.account_type === 'real' ? 'Demo' : 'Real'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Live Trades Control */}
                <div className="bg-gray-800 rounded shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Live Trades Control</h2>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-700 text-gray-300">
                            <tr>
                                <th className="p-2">User</th>
                                <th className="p-2">Symbol</th>
                                <th className="p-2">P/L</th>
                                <th className="p-2">Force Outcome</th>
                            </tr>
                        </thead>
                        <tbody>
                            {openTrades.map(t => (
                                <tr key={t.id} className="border-b border-gray-700">
                                    <td className="p-2">{t.user}</td>
                                    <td className="p-2">{t.symbol}</td>
                                    <td className={`p-2 ${t.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{t.profit}</td>
                                    <td className="p-2 space-x-2">
                                        <button className="px-2 py-1 bg-green-600 rounded text-xs hover:bg-green-500">WIN</button>
                                        <button className="px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-500">LOSS</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
