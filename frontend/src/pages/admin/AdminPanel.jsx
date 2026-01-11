import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
    // State
    const [view, setView] = useState('dashboard'); // 'dashboard', 'users', 'trades', 'settings'
    const [users, setUsers] = useState([]);
    const [trades, setTrades] = useState([]);
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [newUser, setNewUser] = useState({
        full_name: '',
        username: '',
        password: '',
        broker: 'MetaQuotes-Demo',
        account_type: 'demo',
        balance: 10000.0
    });

    // Settlement State
    const [showSettleModal, setShowSettleModal] = useState(false);
    const [selectedTrade, setSelectedTrade] = useState(null);
    const [settleOutcome, setSettleOutcome] = useState(''); // 'WIN' or 'LOSS'
    const [settleAmount, setSettleAmount] = useState('');

    // Fetch Data
    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (view === 'trades') {
            fetchTrades();
        }
    }, [view]);

    const fetchUsers = async () => {
        try {
            // Fetching from backend
            const response = await fetch('http://localhost:8000/admin/users', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')} ` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (e) {
            console.error("Failed to fetch users", e);
        }
    };

    const fetchTrades = async () => {
        try {
            const response = await fetch('http://localhost:8000/admin/trades', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')} ` }
            });
            if (response.ok) setTrades(await response.json());
        } catch (e) { console.error("Failed to fetch trades", e); }
    };

    const openSettleModal = (trade, outcome) => {
        setSelectedTrade(trade);
        setSettleOutcome(outcome);
        setSettleAmount('');
        setShowSettleModal(true);
    };

    const handleSettleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = await fetch(`http://localhost:8000/admin/trades/${selectedTrade.id}/settle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: parseFloat(settleAmount), outcome: settleOutcome })
            });

            if (data.ok) {
                alert("Trade settled successfully!");
                setShowSettleModal(false);
                fetchTrades(); // Refresh list
            } else {
                const err = await data.json();
                alert("Error: " + err.detail);
            }
        } catch (error) {
            alert("Failed to settle trade");
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newUser)
            });
            if (response.ok) {
                setShowCreateUser(false);
                fetchUsers();
                setNewUser({ full_name: '', username: '', password: '', broker: 'MetaQuotes-Demo', account_type: 'demo', balance: 10000.0 });
                alert("User created successfully!");
            } else {
                const err = await response.json();
                alert("Failed to create user: " + (err.detail || "Unknown error"));
            }
        } catch (e) {
            alert("Error creating user");
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-blue-500">Admin Panel</h1>
                    <p className="text-xs text-gray-400 mt-1">Trading Platform Control</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setView('dashboard')} className={`w-full text-left px-4 py-2 rounded font-medium transition-colors ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>Dashboard</button>
                    <button onClick={() => setView('users')} className={`w-full text-left px-4 py-2 rounded font-medium transition-colors ${view === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>Users</button>
                    <button onClick={() => setView('trades')} className={`w-full text-left px-4 py-2 rounded font-medium transition-colors ${view === 'trades' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>Trades</button>
                    <button onClick={() => setView('settings')} className={`w-full text-left px-4 py-2 rounded font-medium transition-colors ${view === 'settings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>Settings</button>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 text-sm"
                    >
                        Back to Mobile App
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-gray-900 p-8">
                {/* Header Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
                        <h3 className="text-gray-400 text-sm uppercase tracking-wider">Total Users</h3>
                        <p className="text-3xl font-bold mt-2">{users.length}</p>
                    </div>
                </div>

                {/* VIEW: USERS */}
                {view === 'users' && (
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold">User Management</h2>
                            <button
                                onClick={() => setShowCreateUser(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold"
                            >
                                + Create User
                            </button>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-750 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Username</th>
                                    <th className="p-4">Broker</th>
                                    <th className="p-4">Balance</th>
                                    <th className="p-4">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-750">
                                        <td className="p-4 font-bold text-white">{u.full_name}</td>
                                        <td className="p-4 text-gray-300">{u.username}</td>
                                        <td className="p-4 text-gray-400">{u.broker}</td>
                                        <td className="p-4 font-mono text-blue-300">${u.balance.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.account_type === 'real' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 'bg-green-500/20 text-green-500 border border-green-500/50'}`}>
                                                {u.account_type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* VIEW: TRADES */}
                {view === 'trades' && (
                    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-700">
                            <h2 className="text-xl font-bold">Trade Management</h2>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-750 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Symbol</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Volume</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Profit</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {trades.map(t => (
                                    <tr key={t.id} className="hover:bg-gray-750">
                                        <td className="p-4 text-gray-500">#{t.id}</td>
                                        <td className="p-4 font-bold text-white">{t.symbol}</td>
                                        <td className={`p-4 font-bold uppercase ${t.type === 'buy' ? 'text-blue-400' : 'text-red-400'}`}>{t.type}</td>
                                        <td className="p-4">{t.volume}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${t.status === 'OPEN' ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-400'}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className={`p-4 font-mono ${t.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {t.profit.toFixed(2)}
                                        </td>
                                        <td className="p-4 space-x-2">
                                            {t.status === 'OPEN' && (
                                                <>
                                                    <button onClick={() => openSettleModal(t, 'WIN')} className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold transition-colors">
                                                        WIN
                                                    </button>
                                                    <button onClick={() => openSettleModal(t, 'LOSS')} className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold transition-colors">
                                                        LOSS
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}


                {/* VIEW: DASHBOARD (Default placeholder) */}
                {view === 'dashboard' && (
                    <div className="text-center text-gray-500 mt-20">
                        <h2 className="text-2xl font-bold">Welcome to Admin Panel</h2>
                        <p>Select a section from the sidebar to manage the platform.</p>
                    </div>
                )}

            </div>

            {/* Create User Modal */}
            {showCreateUser && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96 border border-gray-700">
                        <h2 className="text-xl font-bold mb-6 text-white">Create New User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                                <input required type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                    value={newUser.full_name} onChange={e => setNewUser({ ...newUser, full_name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Username (Login ID)</label>
                                <input required type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                    value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Password</label>
                                <input required type="password" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                    value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Broker Name</label>
                                <input required type="text" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                    value={newUser.broker} onChange={e => setNewUser({ ...newUser, broker: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Account Type</label>
                                <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                    value={newUser.account_type} onChange={e => setNewUser({ ...newUser, account_type: e.target.value })}>
                                    <option value="demo">Demo</option>
                                    <option value="real">Real</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Initial Balance</label>
                                <input required type="number" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                                    value={newUser.balance} onChange={e => setNewUser({ ...newUser, balance: parseFloat(e.target.value) })} />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowCreateUser(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-bold">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Settle Trade Modal */}
            {showSettleModal && selectedTrade && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-80 border border-gray-700 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-1 ${settleOutcome === 'WIN' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <h2 className="text-xl font-bold mb-2 text-white">Settle Trade</h2>
                        <p className="text-sm text-gray-400 mb-6">
                            Force this trade to <span className={`font-bold ${settleOutcome === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>{settleOutcome}</span>
                        </p>

                        <form onSubmit={handleSettleSubmit}>
                            <div className="mb-6">
                                <label className="block text-xs text-gray-400 mb-1">Profit/Loss Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                                    <input
                                        autoFocus
                                        required
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 pl-6 text-white text-lg font-mono focus:border-blue-500 outline-none"
                                        value={settleAmount}
                                        onChange={e => setSettleAmount(e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">
                                    User will {settleOutcome === 'WIN' ? 'gain' : 'lose'} this amount.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowSettleModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm">Cancel</button>
                                <button
                                    type="submit"
                                    className={`flex-1 py-2 rounded font-bold text-white text-sm ${settleOutcome === 'WIN' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}
                                >
                                    Confirm {settleOutcome}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
