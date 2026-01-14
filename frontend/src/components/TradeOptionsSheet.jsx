import React from 'react';

const TradeOptionsSheet = ({ trade, onClose, onClosePosition, onModify, onNewOrder, onChart, onBulk }) => {
    if (!trade) return null;

    // Formatting helpers
    const formatPrice = (p) => p ? p.toFixed(5) : '0.00000';
    const profitClass = trade.profit >= 0 ? 'text-[#0a84ff]' : 'text-[#ff3b30]';

    // Mock data for things we don't track yet
    const openTime = "2026.01.13 19:26:15"; // Mock
    const id = trade.id || "54661834832";
    const swap = "0.00";

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
            {/* Sheet Content */}
            <div
                className="bg-[#1c1c1e] w-full rounded-t-xl overflow-hidden pb-8 animate-in slide-in-from-bottom"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Information */}
                <div className="p-4 border-b border-[#3a3a3c]">
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center space-x-2">
                            <span className="text-base font-bold text-white">{trade.symbol}</span>
                            <span className={`text-sm font-bold ${trade.type === 'buy' ? 'text-[#0a84ff]' : 'text-[#ff3b30]'} uppercase`}>
                                {trade.type} {trade.volume.toFixed(2)}
                            </span>
                        </div>
                        <span className={`text-base font-bold ${profitClass}`}>
                            {trade.profit.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-[#8e8e93] mb-4">
                        <span>{formatPrice(trade.price)}</span>
                        <span>→</span>
                        <span>{formatPrice(trade.currentPrice)}</span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-y-1 text-[13px] text-[#8e8e93]">
                        <div>#{id}</div>
                        <div className="flex justify-between">
                            <span>Open:</span>
                            <span className="text-white">{openTime}</span>
                        </div>

                        <div className="flex justify-between w-1/2">
                            <span>S / L:</span>
                            <span className="text-white">—</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Swap:</span>
                            <span className="text-white">{swap}</span>
                        </div>

                        <div className="flex justify-between w-1/2">
                            <span>T / P:</span>
                            <span className="text-white">—</span>
                        </div>
                    </div>
                </div>

                {/* Actions List */}
                <div className="flex flex-col">
                    <button
                        onClick={() => onClosePosition(trade)}
                        className="text-left px-4 py-3 text-base text-white hover:bg-[#2c2c2e] active:bg-[#3a3a3c] transition-colors"
                    >
                        Close position
                    </button>
                    <button
                        onClick={() => onModify(trade)}
                        className="text-left px-4 py-3 text-base text-white hover:bg-[#2c2c2e] active:bg-[#3a3a3c] transition-colors"
                    >
                        Modify position
                    </button>
                    <button
                        onClick={onNewOrder}
                        className="text-left px-4 py-3 text-base text-white hover:bg-[#2c2c2e] active:bg-[#3a3a3c] transition-colors"
                    >
                        New order
                    </button>
                    <button
                        onClick={onChart}
                        className="text-left px-4 py-3 text-base text-white hover:bg-[#2c2c2e] active:bg-[#3a3a3c] transition-colors"
                    >
                        Chart
                    </button>
                    <button
                        onClick={onBulk}
                        className="text-left px-4 py-3 text-base text-white hover:bg-[#2c2c2e] active:bg-[#3a3a3c] transition-colors"
                    >
                        Bulk Operations...
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradeOptionsSheet;
