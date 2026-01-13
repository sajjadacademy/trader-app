import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Menu } from 'lucide-react';

const QuotesPage = ({ onMenuClick, userQuotes, onAddSymbolClick }) => {

    // We maintain a local version of quotes to handle the high-frequency simulation updates
    // while initializing from the passed props.
    const [quotes, setQuotes] = useState(userQuotes || []);

    // Sync with props when they change (e.g. new symbol added)
    useEffect(() => {
        if (userQuotes) {
            // merge existing simulation state with new props to avoid jitter resets
            setQuotes(prev => {
                const newMap = new Map(userQuotes.map(q => [q.symbol, q]));
                const prevMap = new Map(prev.map(q => [q.symbol, q]));

                return userQuotes.map(q => {
                    // preserve current simulated price if exists, else use default
                    const existing = prevMap.get(q.symbol);
                    if (existing) {
                        return { ...q, ...existing };
                    }
                    return q;
                });
            });
        }
    }, [userQuotes]);

    // Simulation Engine
    useEffect(() => {
        const interval = setInterval(() => {
            setQuotes(prevQuotes => prevQuotes.map(q => {
                // Randomly skip updating some pairs to feel natural
                if (Math.random() > 0.4) return q;

                // Determine direction (random but weighted)
                const isTickUp = Math.random() > 0.5;
                const pipMovement = Math.floor(Math.random() * 5) + 1; // 1-5 pips
                const movementValue = pipMovement * Math.pow(10, -q.digits);

                let newBid = isTickUp ? q.bid + movementValue : q.bid - movementValue;
                // Keep spread mostly constant but fluctuate slightly
                let currentSpread = q.spread * Math.pow(10, q.digits); // converting to points
                // Small spread fluctuation
                // const spreadFluctuation = Math.floor(Math.random() * 3) - 1; 
                // We'll keep spread simple for now to avoid math errors in display

                let newAsk = newBid + (q.spread * Math.pow(10, -q.digits));

                return {
                    ...q,
                    bid: newBid,
                    ask: newAsk,
                    isUp: isTickUp, // Used for color flashing logic if we wanted to flash the whole row, but here mainly for internal state
                    // We also update change percent slightly to make it look alive
                    // changePoint: q.changePoint + (isTickUp ? 1 : -1)
                };
            }));
        }, 800); // 800ms tick rate

        return () => clearInterval(interval);
    }, []);

    // Helper to format prices
    const formatPrice = (priceVal, digits) => {
        if (!priceVal) return { pre: '', big: '', sup: '' };
        const priceStr = priceVal.toFixed(digits);
        const len = priceStr.length;
        const sup = priceStr.slice(-1);
        const big = priceStr.slice(len - 3, len - 1);
        const pre = priceStr.slice(0, len - 3);
        return { pre, big, sup };
    };

    return (
        <div className="flex flex-col h-full bg-black text-white">
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-[#1c1c1e] shrink-0">
                <div className="flex items-center space-x-4">
                    <button onClick={onMenuClick}>
                        <Menu size={24} className="text-white" />
                    </button>
                    <h1 className="text-xl font-bold text-white">Quotes</h1>
                </div>
                <div className="flex items-center space-x-6">
                    <button onClick={onAddSymbolClick} className="text-white"><Plus size={28} strokeWidth={1.5} /></button>
                    <button className="text-white"><Pencil size={24} strokeWidth={1.5} /></button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {quotes.map((q) => {
                    const bidParts = formatPrice(q.bid, q.digits);
                    const askParts = formatPrice(q.ask, q.digits);

                    return (
                        <div key={q.symbol} className="flex justify-between items-center px-4 py-3 border-b border-[#1c1c1e] active:bg-[#1c1c1e] h-[88px]">
                            {/* LEFT: Symbol, Time, Spread, Change */}
                            <div className="flex flex-col justify-between h-full py-1">
                                {/* Change Stat Row */}
                                <div className="flex items-center space-x-2 text-[11px] mb-1 font-medium">
                                    <span className={q.changePoint > 0 ? 'text-[#0a84ff]' : 'text-[#ff3b30]'}>
                                        {q.changePoint > 0 ? '+' : ''}{q.changePoint}
                                    </span>
                                    <span className={q.changePercent > 0 ? 'text-[#0a84ff]' : 'text-[#ff3b30]'}>
                                        {q.changePercent > 0 ? '+' : ''}{q.changePercent}%
                                    </span>
                                </div>

                                {/* Symbol */}
                                <span className="text-white font-bold text-lg leading-tight">{q.symbol}</span>

                                {/* Time & Spread (Mock Time) */}
                                <div className="text-[#8e8e93] text-[11px] flex items-center mt-1 font-medium">
                                    <span>23:59:41</span>
                                    <span className="mx-2 text-[8px] align-middle">╍</span>
                                    <span>{q.spread}</span>
                                </div>
                            </div>

                            {/* RIGHT: Bid / Ask Columns */}
                            <div className="flex space-x-6">
                                {/* BID */}
                                <div className="flex flex-col items-end">
                                    <div className="flex items-baseline">
                                        <span className="text-lg font-medium tracking-tight text-[#b0b0b5]">{bidParts.pre}</span>
                                        <span className="text-3xl font-bold leading-none mx-[1px] text-white">{bidParts.big}</span>
                                        <span className="text-xs font-bold -mt-2 text-[#b0b0b5]">{bidParts.sup}</span>
                                    </div>
                                    <span className="text-[11px] text-[#8e8e93] mt-1 font-medium">L: {q.low.toFixed(q.digits)}</span>
                                </div>

                                {/* ASK */}
                                <div className="flex flex-col items-end">
                                    <div className="flex items-baseline">
                                        <span className="text-lg font-medium tracking-tight text-[#b0b0b5]">{askParts.pre}</span>
                                        <span className="text-3xl font-bold leading-none mx-[1px] text-white">{askParts.big}</span>
                                        <span className="text-xs font-bold -mt-2 text-[#b0b0b5]">{askParts.sup}</span>
                                    </div>
                                    <span className="text-[11px] text-[#8e8e93] mt-1 font-medium">H: {q.high.toFixed(q.digits)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuotesPage;
