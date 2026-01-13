import React, { useState, useEffect, useRef } from 'react';
import { Menu, Plus } from 'lucide-react'; // Removing ArrowUpDown, FolderPlus from imports if not used

const TradePage = ({ onNewOrder, activeTrades = [], balance = 100000, onMenuClick, onCloseTrade }) => {
    // Local state for simulation
    const [simulatedPrices, setSimulatedPrices] = useState({});
    const simulatedVelocitiesRef = useRef({});

    // Combine props with simulation
    const [displayTrades, setDisplayTrades] = useState([]);

    // Stats
    const [stats, setStats] = useState({
        equity: balance,
        margin: 0,
        freeMargin: balance,
        marginLevel: 0
    });

    // Initialize Simulation
    useEffect(() => {
        if (!activeTrades) return;
        setSimulatedPrices(prev => {
            const next = { ...prev };
            activeTrades.forEach(t => {
                if (!next[t.id]) next[t.id] = t.currentPrice || t.price;
            });
            return next;
        });
    }, [activeTrades]);

    // Physics Loop for Price Movement
    useEffect(() => {
        const interval = setInterval(() => {
            setSimulatedPrices(prev => {
                const next = { ...prev };
                const vels = simulatedVelocitiesRef.current;

                activeTrades.forEach(t => {
                    if (!vels[t.id]) vels[t.id] = 0;

                    // Physics
                    const accel = (Math.random() - 0.5) * 0.00005;
                    vels[t.id] += accel;
                    vels[t.id] *= 0.95; // damping

                    // Limit
                    if (vels[t.id] > 0.0005) vels[t.id] = 0.0005;
                    if (vels[t.id] < -0.0005) vels[t.id] = -0.0005;

                    next[t.id] = (next[t.id] || t.price) + vels[t.id];
                });

                simulatedVelocitiesRef.current = vels;
                return next;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [activeTrades]);

    // Update Display Trades & Stats
    useEffect(() => {
        const updatedTrades = activeTrades.map(t => {
            const current = simulatedPrices[t.id] || t.price;
            const diff = t.type === 'buy' ? (current - t.price) : (t.price - current);
            const profit = diff * (t.volume * 100000); // Standard lot logic roughly
            return { ...t, currentPrice: current, profit };
        });

        const totalProfit = updatedTrades.reduce((acc, t) => acc + t.profit, 0);
        const equity = balance + totalProfit;
        const margin = updatedTrades.length * 50; // Simple fixed margin
        const freeMargin = equity - margin;
        const marginLevel = margin > 0 ? (equity / margin) * 100 : 0;

        setDisplayTrades(updatedTrades);
        setStats({ equity, margin, freeMargin, marginLevel });
    }, [activeTrades, simulatedPrices, balance]);

    return (
        <div className="flex flex-col h-full bg-black text-white relative">
            {/* Header */}
            <div className="px-4 py-3 bg-black border-b border-[#3a3a3c]">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onMenuClick}>
                        <Menu size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold">Trade</h1>
                    {/* Placeholder for top right, removed the '+' button from here */}
                    <div className="w-6"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-y-1 text-sm bg-black z-10 relative">
                    <div className="text-[#8e8e93]">Balance</div>
                    <div className="text-right font-bold tracking-tight">{balance.toFixed(2)}</div>

                    <div className="text-[#8e8e93]">Equity</div>
                    <div className="text-right font-bold tracking-tight">{stats.equity.toFixed(2)}</div>

                    <div className="text-[#8e8e93]">Margin</div>
                    <div className="text-right font-bold tracking-tight">{stats.margin.toFixed(2)}</div>

                    <div className="text-[#8e8e93]">Free margin</div>
                    <div className="text-right font-bold tracking-tight">{stats.freeMargin.toFixed(2)}</div>

                    <div className="text-[#8e8e93]">Margin level (%)</div>
                    <div className="text-right font-bold tracking-tight">{stats.marginLevel.toFixed(0)}%</div>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
                {displayTrades.map((trade) => (
                    <div key={trade.id} className="bg-[#1c1c1e] p-3 rounded flex justify-between items-center active:scale-[0.99] transition-transform">
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-white text-base">{trade.symbol}</span>
                                <span className={`text-[11px] font-bold uppercase ${trade.type === 'buy' ? 'text-[#0a84ff]' : 'text-[#ff3b30]'}`}>
                                    {trade.type}
                                </span>
                                <span className="text-[11px] text-[#8e8e93]">{trade.volume.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                                <span className="text-[11px] text-[#8e8e93]">{trade.price.toFixed(5)}</span>
                                <span className="text-[11px] text-[#5c5c5e]">→</span>
                                <span className="text-[11px] text-white">{trade.currentPrice.toFixed(5)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                            {/* Profit */}
                            <span className={`font-bold text-sm ${trade.profit >= 0 ? 'text-[#0a84ff]' : 'text-[#ff3b30]'}`}>
                                {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(2)}
                            </span>
                            {/* Close Button or similar action? Keeping it minimal as per screenshots */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onCloseTrade(trade.id); }}
                                className="text-[10px] bg-[#2c2c2e] px-2 py-0.5 rounded text-[#8e8e93] hover:text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Add Button at Bottom Right (above Tabs) */}
            <div className="absolute bottom-6 right-6 z-50">
                <button
                    onClick={onNewOrder}
                    className="w-14 h-14 bg-[#0a84ff] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                >
                    <Plus size={30} className="text-white" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default TradePage;
