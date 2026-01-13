import React, { useState, useEffect } from 'react';
import { Menu, ArrowUpDown, FolderPlus, X } from 'lucide-react';

const TradePage = ({ onNewOrder, activeTrades, balance, onMenuClick, onCloseTrade }) => {
    // Local state for simulated prices
    const [simulatedPrices, setSimulatedPrices] = useState({});

    // Combine props with simulation
    const [displayTrades, setDisplayTrades] = useState([]);
    const [displayStats, setDisplayStats] = useState({
        balance: 100000,
        equity: 100000,
        margin: 0,
        freeMargin: 100000
    });

    // Initialize/Sync simulation
    useEffect(() => {
        if (!activeTrades) return;

        // Ensure we have a simulated price for every active trade that needs it
        setSimulatedPrices(prev => {
            const next = { ...prev };
            let changed = false;
            activeTrades.forEach(trade => {
                // If trade is not forced, and we don't have a price yet, init it.
                // We use trade.currentPrice (from backend mock) or entry_price as start point.
                if (!trade.forced_outcome && !next[trade.id]) {
                    next[trade.id] = trade.currentPrice || trade.entry_price;
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [activeTrades]);

    // Simulation Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setSimulatedPrices(prev => {
                const next = { ...prev };
                let hasUpdates = false;

                Object.keys(next).forEach(tradeId => {
                    // Find the trade in activeTrades to check status
                    // Note: activeTrades might update, but ids usually stable
                    const trade = activeTrades?.find(t => t.id === parseInt(tradeId) || t.id === tradeId);

                    // Only simulate if trade exists and is not forced
                    if (trade && !trade.forced_outcome) {
                        const current = next[tradeId];
                        // Random walk: +/- small amount
                        // 1 pip = 0.0001
                        // Move between -0.5 to +0.5 pips per tick? Or smaller?
                        // "it should move like a real trade" -> erratic small movements
                        const change = (Math.random() - 0.5) * 0.00010;
                        next[tradeId] = current + change;
                        hasUpdates = true;
                    }
                });

                return hasUpdates ? next : prev;
            });
        }, 100); // 100ms updates

        return () => clearInterval(interval);
    }, [activeTrades]);

    // Calculate Derived State (Display Trades & Stats)
    useEffect(() => {
        const trades = activeTrades || [];
        const currentBalance = balance || 100000.00;

        const processedTrades = trades.map(trade => {
            // If forced outcome, use prop values (passed from MobileApp logic)
            if (trade.forced_outcome) {
                return trade;
            }

            // Otherwise use simulated price to calc profit
            const simPrice = simulatedPrices[trade.id] !== undefined
                ? simulatedPrices[trade.id]
                : (trade.currentPrice || trade.entry_price);

            // Calc Profit
            // Profit = (current - entry) * volume * 100000 * (1 if buy, -1 if sell)
            const multiplier = trade.type === 'buy' ? 1 : -1;
            const diff = simPrice - trade.entry_price;
            const profit = diff * trade.volume * 100000 * multiplier;

            return {
                ...trade,
                currentPrice: simPrice,
                profit: profit
            };
        });

        const floatingPL = processedTrades.reduce((acc, trade) => acc + (trade.profit || 0), 0);
        const equity = currentBalance + floatingPL;
        const margin = processedTrades.reduce((acc, trade) => acc + (trade.volume * 100000 / 100), 0);
        const freeMargin = equity - margin;

        setDisplayTrades(processedTrades);
        setDisplayStats({
            balance: currentBalance,
            equity,
            margin,
            freeMargin
        });

    }, [activeTrades, simulatedPrices, balance]);

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
                <StatRow label="Balance:" value={displayStats.balance} isBold={true} />
                <StatRow label="Equity:" value={displayStats.equity} isBold={true} />
                <StatRow label="Margin:" value={displayStats.margin} />
                <StatRow label="Free margin:" value={displayStats.freeMargin} isBold={true} />
            </div>

            {/* Active Trades List */}
            <div className="flex-1 overflow-y-auto px-4 mt-2 space-y-2">
                {displayTrades.map((trade) => (
                    <div key={trade.id} className="bg-[#1c1c1e] p-3 rounded-lg flex justify-between items-center shadow-sm">
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-lg">{trade.symbol}</span>
                                <span className={`${trade.type === 'buy' ? 'text-blue-400' : 'text-red-400'} text-xs uppercase font-bold`}>{trade.type} {trade.volume}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                                {trade.entry_price?.toFixed(5)} → {trade.currentPrice?.toFixed(5)}
                            </div>
                        </div>
                        <div className={`text-right font-bold ${trade.profit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                            {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(2)}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseTrade(trade.id, trade.currentPrice);
                            }}
                            className="ml-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 active:bg-gray-600 transition-colors"
                        >
                            <X size={16} className="text-gray-400" />
                        </button>
                    </div>
                ))}

                {displayTrades.length === 0 && (
                    <div className="text-center text-gray-600 mt-20 text-sm">
                        No active trades
                    </div>
                )}
            </div>
        </div>
    );
};

export default TradePage;
