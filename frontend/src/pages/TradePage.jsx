import React from 'react';
import { Menu, ArrowUpDown, FolderPlus } from 'lucide-react';

const TradePage = ({ onNewOrder, activeTrades, balance, onMenuClick }) => {
    // Safe defaults
    const trades = activeTrades || [];
    const currentBalance = balance || 100000.00;

    // Calculate equity/margin based on active trades (mock logic)
    const floatingPL = trades.reduce((acc, trade) => acc + (trade.profit || 0), 0);
    const equity = currentBalance + floatingPL;

    // Margin Calculation: Lots * 100000 / Leverage (100)
    const margin = trades.reduce((acc, trade) => acc + (trade.volume * 100000 / 100), 0);
    const freeMargin = equity - margin;

    // Helper for dotted leader
    const StatRow = ({ label, value, isBold = false }) => (
        <div className="flex items-baseline justify-between w-full mb-1">
            <span className={`text-white text-sm ${isBold ? 'font-bold' : ''}`}>{label}</span>
            <div className="flex-1 border-b border-dotted border-gray-600 mx-2 relative top-[-4px]"></div>
            <span className={`text-white text-sm font-bold`}>{value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-black text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black">
                <div className="flex items-center space-x-4">
                    <button onClick={onMenuClick}><Menu size={24} className="text-white" /></button>
                    <h1 className="text-xl font-bold">Trade</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <ArrowUpDown size={24} className="text-white" />
                    <button onClick={onNewOrder}>
                        <FolderPlus size={24} className="text-white" />
                    </button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="p-4 pt-0">
                <StatRow label="Balance:" value={currentBalance} isBold={true} />
                <StatRow label="Equity:" value={equity} isBold={true} />
                <StatRow label="Margin:" value={margin} />
                <StatRow label="Free margin:" value={freeMargin} isBold={true} />
            </div>

            {/* Active Trades List */}
            <div className="flex-1 overflow-y-auto px-4 mt-2 space-y-2">
                {trades.map((trade) => (
                    <div key={trade.id} className="bg-[#1c1c1e] p-3 rounded-lg flex justify-between items-center shadow-sm">
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-lg">{trade.symbol}</span>
                                <span className={`${trade.type === 'buy' ? 'text-blue-400' : 'text-red-400'} text-xs uppercase font-bold`}>{trade.type} {trade.volume}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                                {trade.entryPrice} → {trade.currentPrice}
                            </div>
                        </div>
                        <div className={`text-right font-bold ${trade.profit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                            {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(2)}
                        </div>
                    </div>
                ))}

                {trades.length === 0 && (
                    <div className="text-center text-gray-600 mt-20 text-sm">
                        No active trades
                    </div>
                )}
            </div>
        </div>
    );
};

export default TradePage;
