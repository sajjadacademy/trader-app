import React, { useState } from 'react';

const TradePanel = () => {
    const [activeTab, setActiveTab] = useState('trade'); // trade, exposure, history

    return (
        <div className="h-64 bg-mt5-panel border-t border-gray-700 flex flex-col">
            {/* Tabs */}
            <div className="flex bg-mt5-bg border-b border-gray-700">
                {['Trade', 'Exposure', 'History', 'News', 'Mailbox'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`px-4 py-1 text-sm ${activeTab === tab.toLowerCase() ? 'bg-mt5-panel text-white border-t-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-0">
                <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-mt5-bg text-gray-400 sticky top-0">
                        <tr>
                            <th className="p-2 border-r border-gray-700">Symbol</th>
                            <th className="p-2 border-r border-gray-700">Ticket</th>
                            <th className="p-2 border-r border-gray-700">Time</th>
                            <th className="p-2 border-r border-gray-700">Type</th>
                            <th className="p-2 border-r border-gray-700">Volume</th>
                            <th className="p-2 border-r border-gray-700">Price</th>
                            <th className="p-2 border-r border-gray-700">S/L</th>
                            <th className="p-2 border-r border-gray-700">T/P</th>
                            <th className="p-2 border-r border-gray-700">Price</th>
                            <th className="p-2 border-r border-gray-700">Profit</th>
                            <th className="p-2">X</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {/* Mock Data Row */}
                        <tr className="hover:bg-gray-700">
                            <td className="p-2 border-r border-gray-700">EURUSD</td>
                            <td className="p-2 border-r border-gray-700">100523</td>
                            <td className="p-2 border-r border-gray-700">2023.10.27 10:00</td>
                            <td className="p-2 border-r border-gray-700 text-blue-400">buy</td>
                            <td className="p-2 border-r border-gray-700">1.00</td>
                            <td className="p-2 border-r border-gray-700">1.05000</td>
                            <td className="p-2 border-r border-gray-700">1.04000</td>
                            <td className="p-2 border-r border-gray-700">1.06000</td>
                            <td className="p-2 border-r border-gray-700">1.05050</td>
                            <td className="p-2 border-r border-gray-700 text-blue-400">50.00</td>
                            <td className="p-2 text-center cursor-pointer hover:text-red-500">x</td>
                        </tr>
                        <tr className="bg-mt5-bg font-bold">
                            <td colSpan="9" className="p-2 text-right">Balance: 10,000.00 Equity: 10,050.00 Margin: 0.00</td>
                            <td className="p-2 text-right pr-8">50.00</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TradePanel;
