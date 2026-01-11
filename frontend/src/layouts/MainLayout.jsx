import React from 'react';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col h-screen bg-mt5-bg text-mt5-text">
            {/* Top Bar / Account Info */}
            <div className="h-12 bg-mt5-panel border-b border-gray-700 flex items-center px-4 justify-between">
                <div className="flex items-center space-x-4">
                    <span className="font-bold text-white">Private Practice Trader</span>
                    <div className="bg-green-600 px-2 py-0.5 rounded text-xs text-white">DEMO</div>
                </div>
                <div className="flex space-x-6 text-sm">
                    <div>Balance: <span className="font-mono text-white">10,000.00</span></div>
                    <div>Equity: <span className="font-mono text-white">10,000.00</span></div>
                    <div>Margin: <span className="font-mono text-white">0.00</span></div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar / Market Watch */}
                <div className="w-64 bg-mt5-panel border-r border-gray-700 flex flex-col">
                    <div className="p-2 font-semibold text-xs text-gray-400 uppercase tracking-wider">Market Watch</div>
                    <div className="flex-1 overflow-y-auto">
                        {/* Symbol List Items */}
                        {['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD'].map(symbol => (
                            <div key={symbol} className="flex justify-between items-center px-3 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-800">
                                <div className="font-bold text-sm text-white">{symbol}</div>
                                <div className="text-xs space-x-2">
                                    <span className="text-red-400">1.08500</span>
                                    <span className="text-blue-400">1.08502</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
