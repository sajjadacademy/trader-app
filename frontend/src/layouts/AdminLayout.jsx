import React from 'react';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-4 font-bold text-xl border-b border-gray-700">Admin Panel</div>
                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="block px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">Dashboard</a>
                    <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Users</a>
                    <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Trades</a>
                    <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Settings</a>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button className="text-red-400 text-sm hover:underline">Logout</button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-gray-900">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
