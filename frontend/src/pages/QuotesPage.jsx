import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Menu } from 'lucide-react';

const QuotesPage = ({ onMenuClick }) => {
    // Initial Seed Data for Simulation (30+ Pairs)
    const initialQuotes = [
        // Majors
        { symbol: 'EURUSD', bid: 1.16367, ask: 1.16369, spread: 2, low: 1.16180, high: 1.16621, changePoint: -226, changePercent: -0.19, digits: 5 },
        { symbol: 'GBPUSD', bid: 1.33991, ask: 1.34042, spread: 51, low: 1.33922, high: 1.34504, changePoint: -433, changePercent: -0.32, digits: 5 },
        { symbol: 'USDJPY', bid: 149.501, ask: 149.532, spread: 31, low: 149.200, high: 149.800, changePoint: 105, changePercent: 0.67, digits: 3 },
        { symbol: 'USDCHF', bid: 0.89098, ask: 0.89159, spread: 61, low: 0.88764, high: 0.89171, changePoint: 218, changePercent: 0.27, digits: 5 },
        { symbol: 'AUDUSD', bid: 0.66683, ask: 0.66916, spread: 83, low: 0.66634, high: 0.67038, changePoint: -156, changePercent: -0.23, digits: 5 },
        { symbol: 'USDCAD', bid: 1.36500, ask: 1.36530, spread: 30, low: 1.36200, high: 1.36800, changePoint: 50, changePercent: 0.04, digits: 5 },
        { symbol: 'NZDUSD', bid: 0.57269, ask: 0.57359, spread: 90, low: 0.57108, high: 0.57530, changePoint: -253, changePercent: -0.44, digits: 5 },

        // Minors & Crosses
        { symbol: 'EURGBP', bid: 0.86540, ask: 0.86560, spread: 20, low: 0.86400, high: 0.86700, changePoint: 12, changePercent: 0.05, digits: 5 },
        { symbol: 'EURJPY', bid: 158.200, ask: 158.250, spread: 50, low: 157.800, high: 158.500, changePoint: 150, changePercent: 0.40, digits: 3 },
        { symbol: 'GBPJPY', bid: 182.500, ask: 182.600, spread: 100, low: 181.900, high: 183.000, changePoint: -80, changePercent: -0.15, digits: 3 },
        { symbol: 'AUDJPY', bid: 95.400, ask: 95.450, spread: 50, low: 95.000, high: 95.800, changePoint: 200, changePercent: 0.50, digits: 3 },
        { symbol: 'CADJPY', bid: 109.100, ask: 109.150, spread: 50, low: 108.800, high: 109.500, changePoint: 50, changePercent: 0.12, digits: 3 },
        { symbol: 'CHFJPY', bid: 165.300, ask: 165.400, spread: 100, low: 165.000, high: 166.000, changePoint: -150, changePercent: -0.35, digits: 3 },

        // Exotics
        { symbol: 'USDCNH', bid: 7.27298, ask: 7.27943, spread: 645, low: 7.25138, high: 7.29400, changePoint: -901, changePercent: -0.13, digits: 5 },
        { symbol: 'USDRUB', bid: 92.505, ask: 95.645, spread: 3140, low: 91.455, high: 96.797, changePoint: -1384, changePercent: -1.75, digits: 3 },
        { symbol: 'USDTRY', bid: 27.500, ask: 27.800, spread: 3000, low: 27.200, high: 28.100, changePoint: 5000, changePercent: 2.50, digits: 3 },
        { symbol: 'USDZAR', bid: 18.900, ask: 18.950, spread: 500, low: 18.700, high: 19.100, changePoint: 2000, changePercent: 0.85, digits: 3 },
        { symbol: 'USDMXN', bid: 17.500, ask: 17.550, spread: 500, low: 17.300, high: 17.700, changePoint: -400, changePercent: -0.25, digits: 3 },

        // Metals & Indices
        { symbol: 'XAUUSD', bid: 1980.50, ask: 1981.10, spread: 60, low: 1970.00, high: 1990.00, changePoint: 1560, changePercent: 0.78, digits: 2 },
        { symbol: 'XAGUSD', bid: 23.450, ask: 23.480, spread: 30, low: 23.100, high: 23.800, changePoint: -120, changePercent: -0.50, digits: 3 },
        { symbol: 'US500', bid: 4350.50, ask: 4351.00, spread: 50, low: 4330.00, high: 4370.00, changePoint: 2500, changePercent: 0.55, digits: 2 },
        { symbol: 'US30', bid: 33800.0, ask: 33805.0, spread: 500, low: 33600.0, high: 34000.0, changePoint: -15000, changePercent: -0.45, digits: 1 },
        { symbol: 'DE40', bid: 15400.0, ask: 15405.0, spread: 500, low: 15300.0, high: 15500.0, changePoint: 8000, changePercent: 0.52, digits: 1 },

        // Crypto
        { symbol: 'BTCUSD', bid: 34500.0, ask: 34510.0, spread: 1000, low: 34000.0, high: 35000.0, changePoint: 25000, changePercent: 0.75, digits: 1 },
        { symbol: 'ETHUSD', bid: 1850.50, ask: 1851.50, spread: 100, low: 1820.00, high: 1880.00, changePoint: -2500, changePercent: -1.35, digits: 2 },
        { symbol: 'LTCUSD', bid: 65.40, ask: 65.50, spread: 10, low: 64.00, high: 67.00, changePoint: 120, changePercent: 1.80, digits: 2 },
        { symbol: 'XRPUSD', bid: 0.55040, ask: 0.55090, spread: 50, low: 0.54000, high: 0.56000, changePoint: -150, changePercent: -2.10, digits: 5 },
    ];

    const [quotes, setQuotes] = useState(initialQuotes);

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
                    <button className="text-white"><Plus size={28} strokeWidth={1.5} /></button>
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
