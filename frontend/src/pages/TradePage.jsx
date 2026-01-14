import React, { useState, useEffect, useRef } from 'react';
import { Menu, ArrowUpDown } from 'lucide-react';
import TradeOptionsSheet from '../components/TradeOptionsSheet';
import ClosePositionScreen from '../components/ClosePositionScreen';

// Dotted Stat Row Component
const StatRow = ({ label, value }) => (
    <div className="flex items-end justify-between w-full mb-3">
        <span className="text-[#cfcfcf] text-sm font-bold leading-none">{label}</span>
        <div className="flex-1 mx-2 border-b-2 border-dotted border-[#333] mb-[4px]"></div>
        <span className="text-[#cfcfcf] text-sm font-bold leading-none">
            {typeof value === 'number' ? value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : value}
        </span>
    </div>
);

const TradePage = ({ onNewOrder, activeTrades = [], balance = 100000, onMenuClick, onCloseTrade, onOpenChart }) => {
    // Local state for simulation
    const [simulatedPrices, setSimulatedPrices] = useState({});
    const simulatedVelocitiesRef = useRef({});

    // Sheet State
    const [selectedTrade, setSelectedTrade] = useState(null);
    const [closingTrade, setClosingTrade] = useState(null);

    // Combine props with simulation
    const [displayTrades, setDisplayTrades] = useState([]);

    // Stats
    const [stats, setStats] = useState({
        equity: balance || 0,
        margin: 0,
        freeMargin: balance || 0,
        marginLevel: 0
    });

    // Initialize Simulation
    useEffect(() => {
        if (!activeTrades || activeTrades.length === 0) return;
        setSimulatedPrices(prev => {
            const next = { ...prev };
            activeTrades.forEach(t => {
                const price = t.currentPrice || t.price || 0;
                if (!next[t.id]) next[t.id] = price;
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
                    if (!t || !t.id) return;
                    if (!vels[t.id]) vels[t.id] = 0;

                    // CHECK FOR ADMIN TARGET PROFIT
                    if (t.targetProfit !== undefined && t.targetProfit !== null) {
                        // Admin Controlled Simulation
                        const multiplier = t.type === 'buy' ? 1 : -1;
                        const priceDiff = t.targetProfit / (t.volume * 100000 * multiplier);
                        const targetPrice = (t.entry_price || t.price) + priceDiff;

                        // Add "Upset Down" Fluctuation (Noise)
                        const noise = (Math.random() - 0.5) * 0.0012; // 0.0012 range -> +/- 0.0006

                        next[t.id] = targetPrice + noise;
                        vels[t.id] = 0;
                    } else {
                        // Standard Random Walk Physics
                        const accel = (Math.random() - 0.5) * 0.00005;
                        vels[t.id] += accel;
                        vels[t.id] *= 0.95; // damping

                        // Limit
                        if (vels[t.id] > 0.0005) vels[t.id] = 0.0005;
                        if (vels[t.id] < -0.0005) vels[t.id] = -0.0005;

                        const basePrice = next[t.id] || t.price || 0;
                        if (basePrice > 0) {
                            next[t.id] = basePrice + vels[t.id];
                        }
                    }
                });

                simulatedVelocitiesRef.current = vels;
                return next;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [activeTrades]);

    // Update Display Trades & Stats
    useEffect(() => {
        if (!activeTrades) return;

        const updatedTrades = activeTrades.map(t => {
            const basePrice = t.price || 0;
            const current = simulatedPrices[t.id] || basePrice;

            // Safety check for calculation
            if (!basePrice || !current) {
                return { ...t, currentPrice: current || 0, profit: 0 };
            }

            const diff = t.type === 'buy' ? (current - basePrice) : (basePrice - current);
            const vol = t.volume || 0;
            const profit = diff * (vol * 100000); // Standard lot logic roughly
            return { ...t, currentPrice: current, profit };
        });

        const totalProfit = updatedTrades.reduce((acc, t) => acc + (t.profit || 0), 0);
        const currentBalance = balance || 0;
        const equity = currentBalance + totalProfit;
        const margin = updatedTrades.length * 50; // Simple fixed margin
        const freeMargin = equity - margin;
        const marginLevel = margin > 0 ? (equity / margin) * 100 : 0;

        // Establish live trade data for the selected sheet if open
        if (selectedTrade) {
            const liveSelected = updatedTrades.find(t => t.id === selectedTrade.id);
            if (liveSelected) setSelectedTrade(liveSelected);
        }

        setDisplayTrades(updatedTrades);
        setStats({ equity, margin, freeMargin, marginLevel });
    }, [activeTrades, simulatedPrices, balance]);

    return (
        <div className="flex flex-col h-full bg-black text-white relative font-sans">
            {/* Header */}
            <div className="px-4 py-3 bg-black">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onMenuClick}>
                            <Menu size={24} className="text-white" />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium">Trade</span>
                            <span className={`text-lg font-bold ${((stats.equity || 0) - (balance || 0)) < 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                {((stats.equity || 0) - (balance || 0)).toFixed(2)} USD
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        {/* Sort Icon */}
                        <div className="relative">
                            <ArrowUpDown size={24} className="text-white" strokeWidth={1.5} />
                        </div>
                        {/* New Order Icon (File with Plus) */}
                        <button onClick={onNewOrder}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="12" y1="18" x2="12" y2="12"></line>
                                <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className=" pb-2">
                    <StatRow label="Balance:" value={balance || 0} />
                    <StatRow label="Equity:" value={stats.equity || 0} />
                    <StatRow label="Margin:" value={stats.margin || 0} />
                    <StatRow label="Free margin:" value={stats.freeMargin || 0} />
                    <div className="flex items-end justify-between w-full mb-3">
                        <span className="text-[#cfcfcf] text-sm font-bold leading-none">Margin Level (%):</span>
                        <div className="flex-1 mx-2 border-b-2 border-dotted border-[#333] mb-[4px]"></div>
                        <span className="text-[#cfcfcf] text-sm font-bold leading-none">
                            {(stats.marginLevel || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Positions Divider */}
            <div className="bg-black px-4 py-2 flex justify-between items-center border-t border-b border-[#2c2c2e]">
                <span className="text-[#a0a0a0] text-sm font-bold">Positions</span>
                <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto pb-24 border-t border-gray-800">
                {displayTrades.map((trade) => {
                    const vol = trade.volume || 0;
                    const price = trade.price || 0;
                    const currentP = trade.currentPrice || 0;
                    const profitVal = trade.profit || 0;

                    return (
                        <div
                            key={trade.id || Math.random()}
                            onClick={() => setSelectedTrade(trade)}
                            className="bg-black border-b border-gray-800 p-3 pt-4 pb-4 flex justify-between items-center active:bg-[#1c1c1e] transition-colors cursor-pointer"
                        >
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-white text-base">{trade.symbol || '???'},</span>
                                    <span className={`text-sm font-bold ${trade.type === 'buy' ? 'text-blue-500' : 'text-red-500'}`}>
                                        {trade.type} {vol.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                                    <span>{price.toFixed(5)}</span>
                                    <span>→</span>
                                    <span>{currentP.toFixed(5)}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                {/* Profit */}
                                <span className={`font-bold text-lg ${profitVal >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                                    {profitVal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Trade Options Sheet */}
            {selectedTrade && (
                <TradeOptionsSheet
                    trade={selectedTrade}
                    onClose={() => setSelectedTrade(null)}
                    onClosePosition={(t) => {
                        setSelectedTrade(null);
                        setClosingTrade(t);
                    }}
                    onNewOrder={() => {
                        setSelectedTrade(null);
                        onNewOrder();
                    }}
                    onChart={() => {
                        setSelectedTrade(null);
                        if (onOpenChart) onOpenChart();
                    }}
                    onModify={() => alert("Modify Position functionality coming soon")}
                    onBulk={() => alert("Bulk Operations functionality coming soon")}
                />
            )}

            {/* Close Position Screen */}
            {closingTrade && (
                <ClosePositionScreen
                    trade={closingTrade}
                    onClose={() => setClosingTrade(null)}
                    onConfirmClose={(t) => {
                        // Actual close callback
                        const closingPrice = t.currentPrice || t.price;
                        onCloseTrade(t.id, closingPrice);
                        setClosingTrade(null);
                    }}
                />
            )}
        </div>
    );
};

export default TradePage;
