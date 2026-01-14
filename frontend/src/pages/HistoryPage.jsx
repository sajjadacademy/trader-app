import React, { useState } from 'react';
import { Menu, RefreshCw, ArrowUpDown, Calendar } from 'lucide-react';

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
            <span className="text-gray-300 text-sm font-bold">{label}</span>
            <div className="flex-1 border-b border-dotted border-gray-700 mx-2 relative top-[-4px]"></div>
            <span className={`text-sm font-bold ${isBlue ? 'text-blue-500' : 'text-white'}`}>
                {typeof value === 'number' ? value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : value}
            </span>
        </div>
    );

    // Custom Calendar Icon (2 lines of 4 dots)
    const CustomCalendarIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            {/* Dots custom representation */}
            <circle cx="7" cy="14" r="1" fill="currentColor" stroke="none" />
            <circle cx="10.33" cy="14" r="1" fill="currentColor" stroke="none" />
            <circle cx="13.66" cy="14" r="1" fill="currentColor" stroke="none" />
            <circle cx="17" cy="14" r="1" fill="currentColor" stroke="none" />

            <circle cx="7" cy="18" r="1" fill="currentColor" stroke="none" />
            <circle cx="10.33" cy="18" r="1" fill="currentColor" stroke="none" />
            <circle cx="13.66" cy="18" r="1" fill="currentColor" stroke="none" />
            <circle cx="17" cy="18" r="1" fill="currentColor" stroke="none" />
        </svg>
    );

    // Date formatter helper
    const formatDate = (dateString) => {
        if (!dateString) return 'Active';
        try {
            // Ensure we have a valid date object
            const date = new Date(dateString);

            // Format: YYYY.MM.DD HH:mm:ss
            // Matches user screenshot request: "2026.01.13 19:25:15"

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
        } catch (e) {
            return dateString;
        }
    };

    const renderTradeList = () => (
        <div className="flex-1 overflow-y-auto px-4">
            {/* Balance/Deposit Entry */}
            <div className="flex justify-between items-start py-3 border-b-4 border-[#1c1c1e]">
                <div>
                    <h3 className="font-bold text-gray-200 text-md">Balance</h3>
                </div>
                <div className="text-right">
                    <div className="text-[#8e8e93] text-[13px] font-medium mb-1">
                        {formatDate(historyTrades.length > 0 ? historyTrades[historyTrades.length - 1].open_time : '2026-01-01T00:00:00.000Z')}
                    </div>
                    <div className="font-bold text-blue-500">{deposit.toFixed(2)}</div>
                </div>
            </div>

            {historyTrades.map((trade) => (
                <div key={trade.id} className="flex justify-between items-start py-3 border-b-4 border-[#1c1c1e]">
                    <div className="space-y-0.5">
                        {/* Upper Left: Symbol + Action */}
                        <div className="flex items-baseline gap-2">
                            <h3 className="font-bold text-gray-200 text-md">{trade.symbol},</h3>
                            <span className={`${trade.type === 'buy' ? 'text-blue-500' : 'text-red-500'} text-sm font-medium lowercase`}>
                                {trade.type} {trade.volume}
                            </span>
                        </div>
                        {/* Lower Left: Price Range */}
                        <div className="text-sm text-gray-400">
                            {trade.entry_price ? trade.entry_price.toFixed(5) : '0.00000'} → {trade.close_price ? trade.close_price.toFixed(5) : '0.00000'}
                        </div>
                    </div>

                    <div className="text-right space-y-0.5">
                        {/* Upper Right: Date */}
                        <div className="text-[#8e8e93] text-[13px] font-medium">
                            {trade.status === 'OPEN' ? 'Active' : formatDate(trade.close_time)}
                        </div>
                        {/* Lower Right: Profit */}
                        <div className={`font-bold ${trade.profit >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                            {trade.profit.toFixed(2)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-black text-gray-300 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black">
                <div className="flex items-center gap-6">
                    <button onClick={onMenuClick}><Menu size={24} className="text-[#b0b0b0]" /></button>
                    <div className="flex flex-col">
                        <span className="text-[13px] text-[#8e8e93] font-medium tracking-wide leading-none">History</span>
                        <h1 className="text-xl font-bold text-[#e1e1e1] tracking-wide leading-tight mt-0.5">All symbols</h1>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    {/* Circle Arrows with $ - RefreshCw is Clockwise (matches screenshot) */}
                    <div className="relative flex items-center justify-center">
                        <RefreshCw size={24} className="text-[#b0b0b0]" strokeWidth={2} />
                        <span className="absolute text-[11px] text-[#b0b0b0] font-bold pt-[1px]">$</span>
                    </div>
                    <ArrowUpDown size={24} className="text-[#b0b0b0]" strokeWidth={2} />
                    <CustomCalendarIcon />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between px-6 mb-2">
                {['POSITIONS', 'ORDERS', 'DEALS'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex-1 text-center ${activeTab === tab ? 'text-gray-200 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-400'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Stats Section */}
            <div className="px-4 py-2">
                <StatRow label="Profit:" value={totalProfit} isBlue={totalProfit >= 0} />
                <StatRow label="Deposit:" value={deposit} />
                <StatRow label="Swap:" value={totalSwap} />
                <StatRow label="Commission:" value={totalCommission} />
                <StatRow label="Balance:" value={currentBalance} />
            </div>

            <div className="h-[4px] bg-[#1c1c1e] mx-0 mb-0"></div>

            {/* List Content */}
            {renderTradeList()}
        </div>
    );
};

export default HistoryPage;
