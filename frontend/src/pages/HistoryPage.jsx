import React, { useState } from 'react';
import { Menu, RefreshCcw, ArrowUpDown, Calendar } from 'lucide-react';

const HistoryPage = ({ historyTrades, onMenuClick, balance }) => {
    const [activeTab, setActiveTab] = useState('POSITIONS');

    // Stats Calculation
    const totalProfit = historyTrades.reduce((acc, trade) => acc + (trade.profit || 0), 0);
    const totalSwap = historyTrades.reduce((acc, trade) => acc + (trade.swap || 0), 0);
    const totalCommission = historyTrades.reduce((acc, trade) => acc + (trade.commission || 0), 0);

    // Deposit calculation: Current Balance - (Profit + Swap + Commission)
    // If balance is undefined/loading, default to 100k and assume that was deposit
    const currentBalance = balance !== undefined ? balance : 100000.00;
    const deposit = currentBalance - (totalProfit + totalSwap + totalCommission);

    // Helper for dotted leader
    const StatRow = ({ label, value, isBlue = false }) => (
        <div className="flex items-baseline justify-between w-full mb-1">
            <span className="text-white text-sm font-bold">{label}</span>
            <div className="flex-1 border-b border-dotted border-gray-600 mx-2 relative top-[-4px]"></div>
            <span className={`text-sm font-bold ${isBlue ? 'text-blue-500' : 'text-white'}`}>
                {typeof value === 'number' ? value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : value}
            </span>
        </div>
    );

    const renderTradeList = () => (
        <div className="flex-1 overflow-y-auto px-4 space-y-3">
            {/* Balance/Deposit Entry */}
            <div className="flex justify-between items-center py-2">
                <div>
                    <h3 className="font-bold text-white text-md">Balance</h3>
                    {/* Use the created_at of the first trade or just a placeholder if empty */}
                    <p className="text-xs text-gray-500">
                        {historyTrades.length > 0 ? historyTrades[historyTrades.length - 1].open_time : '2026.01.01 00:00:00'}
                    </p>
                </div>
                <div className="text-right">
                    <div className="font-bold text-blue-500">{deposit.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Deposit</div>
                </div>
            </div>

            {historyTrades.map((trade) => (
                <div key={trade.id} className="flex justify-between items-center py-2 border-b border-[#2c2c2e]">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-white text-md">{trade.symbol}</h3>
                            <span className={`${trade.type === 'buy' ? 'text-blue-500' : 'text-red-500'} text-xs font-bold uppercase`}>
                                {trade.type} {trade.volume}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            {trade.close_time ? new Date(trade.close_time).toLocaleString().replace(',', '') : 'Active'}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className={`font-bold ${trade.profit >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                            {trade.profit.toFixed(2)}
                        </div>
                        {/* Show Entry -> Close Price for extra detail */}
                        <div className="text-[10px] text-gray-500">
                            {trade.entry_price} → {trade.close_price}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-black text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black">
                <div className="flex items-center space-x-4">
                    <button onClick={onMenuClick}><Menu size={24} className="text-white" /></button>
                    <div>
                        <h1 className="text-xl font-bold">History</h1>
                        <p className="text-xs text-gray-400">All symbols</p>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <RefreshCcw size={22} className="text-white" />
                    <ArrowUpDown size={22} className="text-white" />
                    <Calendar size={22} className="text-white" />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-6 px-4 mb-2 border-b border-[#2c2c2e]">
                {['POSITIONS', 'ORDERS', 'DEALS'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === tab ? 'text-white border-white' : 'text-gray-500 border-transparent'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Stats Section */}
            <div className="p-4 pt-2 pb-2">
                <StatRow label="Profit:" value={totalProfit} isBlue={totalProfit >= 0} />
                <StatRow label="Deposit:" value={deposit} />
                <StatRow label="Swap:" value={totalSwap} />
                <StatRow label="Commission:" value={totalCommission} />
                <StatRow label="Balance:" value={currentBalance} />
            </div>

            <div className="h-[1px] bg-[#2c2c2e] mx-4 mb-2"></div>

            {/* List Content */}
            {/* For now, we populate all tabs with the same trade history data 
                as "Positions", "Orders", and "Deals" in this simplified model 
                all refer to the same set of closed trade records. */}
            {renderTradeList()}
        </div>
    );
};

export default HistoryPage;
