import React, { useEffect } from 'react';

const OrderConfirmation = ({ trade, onDone }) => {
    // trade object structure expected:
    // { symbol: 'EURUSD', type: 'buy', volume: 0.01, price: 1.16431, id: '#54661839181' }

    return (
        <div className="flex flex-col h-full bg-black text-white relative z-50">
            {/* Header */}
            <div className="flex items-center p-4">
                <div className="flex items-center space-x-4">
                    <button onClick={onDone} className="text-white">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <h1 className="text-xl font-bold">New Order</h1>
                </div>
                <div className="ml-auto">
                    <button className="text-gray-400">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </button>
                </div>
            </div>

            {/* Content Center */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                {/* Big Green Circle Icon */}
                <div className="w-24 h-24 rounded-full bg-[#87bd8f] flex items-center justify-center mb-6">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="text-black/80">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="9 15 11 17 15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold mb-2">Done</h2>

                <div className="text-center space-y-1">
                    <div className="text-lg font-bold">
                        <span className={trade.type === 'buy' ? 'text-[#0a84ff]' : 'text-[#ff3b30]'}>
                            {trade.type.toUpperCase()}
                        </span>
                        <span className="text-[#8e8e93]"> {trade.volume.toFixed(2)} / {trade.volume.toFixed(2)}</span>
                    </div>

                    <div className="text-gray-400 text-sm">
                        {trade.symbol} at {trade.price.toFixed(5)}
                    </div>

                    <div className="text-gray-500 text-sm">
                        #{trade.id}
                    </div>
                </div>
            </div>

            {/* Bottom Button */}
            <div className="p-4 bg-[#1c1c1e]">
                <button
                    onClick={onDone}
                    className="w-full py-3 text-center text-white font-bold text-sm uppercase tracking-wide rounded hover:bg-white/5 active:bg-white/10 transition"
                >
                    DONE
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;
