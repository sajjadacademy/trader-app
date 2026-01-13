import React, { useState, useEffect, useRef } from 'react';
import { Menu, ArrowUpDown, FolderPlus, X } from 'lucide-react';

const TradePage = ({ onNewOrder, activeTrades, balance, onMenuClick, onCloseTrade }) => {
    // Local state for simulation
    const [simulatedPrices, setSimulatedPrices] = useState({});
    const simulatedVelocitiesRef = useRef({}); // Using a ref for velocities to avoid re-renders

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

        setSimulatedPrices(prevPrices => {
            const nextPrices = { ...prevPrices };
            let changed = false;

            activeTrades.forEach(trade => {
                if (!trade.forced_outcome && !nextPrices[trade.id]) {
                    nextPrices[trade.id] = trade.currentPrice || trade.entry_price;
                    changed = true;
                }
            });
            return changed ? nextPrices : prevPrices;
        });

        // Initialize velocities if missing
        const currentVelocities = simulatedVelocitiesRef.current;
        let velocitiesChanged = false;
        activeTrades.forEach(trade => {
            if (!trade.forced_outcome && currentVelocities[trade.id] === undefined) {
                currentVelocities[trade.id] = 0; // Start with 0 velocity
                velocitiesChanged = true;
            }
        });
        if (velocitiesChanged) {
            simulatedVelocitiesRef.current = { ...currentVelocities };
        }
    }, [activeTrades]);

    // Simulation Timer (Momentum Based)
    useEffect(() => {
        const interval = setInterval(() => {
            setSimulatedPrices(prevPrices => {
                const nextPrices = { ...prevPrices };
                const currentVelocities = simulatedVelocitiesRef.current;
                let hasUpdates = false;

                Object.keys(nextPrices).forEach(tradeId => {
                    const trade = activeTrades?.find(t => t.id === parseInt(tradeId) || t.id === tradeId);

                    if (trade && !trade.forced_outcome) {
                        let currentPrice = nextPrices[tradeId];
                        let currentVelocity = currentVelocities[tradeId] || 0;

                        // Physics parameters
                        const accelerationFactor = 0.00002; // Increased for visibility
                        const dampingFactor = 0.95;
                        const maxVelocity = 0.001;          // Increased cap

                        // Apply random acceleration
                        const acceleration = (Math.random() - 0.5) * accelerationFactor;
                        currentVelocity += acceleration;

                        // Apply damping
                        currentVelocity *= dampingFactor;

                        // Clamp velocity
                        currentVelocity = Math.max(-maxVelocity, Math.min(maxVelocity, currentVelocity));

                        // Update price
                        currentPrice += currentVelocity;

                        nextPrices[tradeId] = currentPrice;
                        currentVelocities[tradeId] = currentVelocity; // Update ref directly
                        hasUpdates = true;
                    }
                });

                // Ensure the ref is updated with the new velocities
                simulatedVelocitiesRef.current = { ...currentVelocities };

                return hasUpdates ? nextPrices : prevPrices;
            });
        }, 100); // 100ms updates

        return () => clearInterval(interval);
    }, [activeTrades]);

    // Calculate Derived State (Display Trades & Stats)
    useEffect(() => {
        const trades = activeTrades || [];
        const currentBalance = balance || 100000.00;

        const processedTrades = trades.map(trade => {
            // If forced outcome, use prop values
            if (trade.forced_outcome) {
                return trade;
            }

            // Otherwise use simulated price to calc profit
            const simPrice = simulatedPrices[trade.id] !== undefined
                ? simulatedPrices[trade.id]
                : (trade.currentPrice || trade.entry_price);

            // Calc Profit
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

    // Helper for formatting money like "100 000.00"
    const formatMoney = (val) => {
        if (val === undefined || val === null) return "0.00";
        return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    // Helper for dotted leader rows
    const StatRow = ({ label, value }) => (
        <div className="flex items-end justify-between w-full mb-1">
            <span className="text-[#8e8e93] text-sm whitespace-nowrap">{label}</span>
            <div className="flex-1 border-b border-dotted border-[#3a3a3c] mx-1 relative top-[-4px]"></div>
            <span className="text-white text-sm font-bold whitespace-nowrap">{formatMoney(value)}</span>
        </div>
    );

    const marginLevel = displayStats.margin > 0 ? (displayStats.equity / displayStats.margin) * 100 : 0;

    return (
        <div className="flex flex-col h-full bg-black text-white font-sans">
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 shrink-0 bg-black">
                <div className="flex items-center space-x-4">
                    <button onClick={onMenuClick}>
                        <Menu size={24} className="text-white" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-gray-400 leading-tight">Trade</span>
                        {/* Show total floating PL in header if active trades exist, else show nothing or balance */}
                        {activeTrades && activeTrades.length > 0 && (
                            <span className={`text-sm font-bold ${displayStats.equity >= displayStats.balance ? 'text-[#0a84ff]' : 'text-[#ff3b30]'}`}>
                                {(displayStats.equity - displayStats.balance).toFixed(2)} USD
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-5">
                    <button className="text-white transform rotate-90"><ArrowUpDown size={20} strokeWidth={2} /></button>
                    <button onClick={onNewOrder} className="text-white border border-white/20 rounded p-0.5">
                        <FolderPlus size={18} strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Stats Area */}
            <div className="px-4 py-2 mt-1 space-y-1 bg-black">
                <StatRow label="Balance:" value={displayStats.balance} />
                <StatRow label="Equity:" value={displayStats.equity} />
                <StatRow label="Margin:" value={displayStats.margin} />
                <StatRow label="Free margin:" value={displayStats.freeMargin} />
                <StatRow label="Margin Level (%):" value={marginLevel} />
            </div>

            {/* Positions Header */}
            <div className="flex items-center justify-between px-4 py-2 mt-2 bg-[#1c1c1e]">
                <span className="text-sm font-bold text-white">Positions</span>
                <span className="text-gray-400 pb-2">...</span>
            </div>

            {/* Trade List */}
            <div className="flex-1 overflow-y-auto bg-black">
                {displayTrades.map((trade) => {
                    const isProfit = trade.profit >= 0;
                    return (
                        <div key={trade.id} className="flex justify-between items-center px-4 py-3 border-b border-[#1c1c1e] bg-black active:bg-[#1c1c1e]" onClick={() => onCloseTrade(trade.id, trade.currentPrice)}>
                            {/* Left: Info */}
                            <div className="flex flex-col space-y-1">
                                <div className="flex items-baseline space-x-2">
                                    <span className="font-bold text-base text-white">{trade.symbol},</span>
                                    <span className={`text-sm font-bold ${trade.type === 'buy' ? 'text-[#0a84ff]' : 'text-[#ff3b30]'}`}>
                                        {trade.type} {Number(trade.volume).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-[#8e8e93]">
                                    <span>{trade.entry_price?.toFixed(5)}</span>
                                    <span>→</span>
                                    <span>{trade.currentPrice?.toFixed(5)}</span>
                                </div>
                            </div>

                            {/* Right: Profit */}
                            <div className={`text-base font-bold ${isProfit ? 'text-[#0a84ff]' : 'text-[#ff3b30]'}`}>
                                {isProfit ? '' : ''}{trade.profit.toFixed(2)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TradePage;
