import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const NewOrderPage = ({ symbol = 'EURUSD', onClose, onPlaceOrder, currentBid = 1.16413, currentAsk = 1.16416 }) => {

    const [volume, setVolume] = useState(0.01);

    // Local simulation for the mini-chart and big digits tick
    const [bid, setBid] = useState(currentBid);
    const [ask, setAsk] = useState(currentAsk);
    const [tickHistory, setTickHistory] = useState([]); // Array of prices for chart

    useEffect(() => {
        // Init history
        const initialPoints = Array(50).fill(0).map((_, i) => currentBid + (Math.random() - 0.5) * 0.0005);
        setTickHistory(initialPoints);

        const interval = setInterval(() => {
            setBid(prev => {
                const move = (Math.random() - 0.5) * 0.0001;
                const next = prev + move;
                setAsk(next + 0.00003); // Fixed spreadish

                setTickHistory(h => [...h.slice(1), next]);
                return next;
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Helper to format big digits
    const formatBig = (price) => {
        const str = price.toFixed(5);
        return {
            small: str.slice(0, 4),
            big: str.slice(4, 6),
            sup: str.slice(6)
        };
    };

    const bidParts = formatBig(bid);
    const askParts = formatBig(ask);

    // Dynamic color for chart line (simple red/blue based on last move)
    const isUp = tickHistory[tickHistory.length - 1] > tickHistory[tickHistory.length - 2];
    const chartColor = isUp ? '#0a84ff' : '#ff3b30';

    return (
        <div className="flex flex-col h-full bg-black text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#1c1c1e]">
                <button onClick={onClose}><ArrowLeft size={24} className="text-white" /></button>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold">{symbol}</h1>
                    <span className="text-xs text-gray-400">Euro vs US Dollar</span>
                </div>
                <button><RefreshCw size={24} className="text-white" /></button>
            </div>

            {/* Market Execution Dropdown Box */}
            <div className="mx-4 mt-6 p-3 border border-white/20 rounded text-center mb-6 relative">
                <span className="text-sm font-bold">Market Execution</span>
                <div className="absolute right-2 bottom-1 w-2 h-2 bg-white transform rotate-45 translate-y-1/2"></div>
            </div>

            {/* Volume Selector */}
            <div className="flex justify-between items-center mb-8 px-4">
                <button onClick={() => setVolume(Math.max(0.01, volume - 0.5))} className="text-[#8e8e93] font-bold text-sm">-0.5</button>
                <button onClick={() => setVolume(Math.max(0.01, volume - 0.1))} className="text-[#8e8e93] font-bold text-sm">-0.1</button>
                <button onClick={() => setVolume(Math.max(0.01, volume - 0.01))} className="text-[#8e8e93] font-bold text-sm">-0.01</button>

                <span className="text-white font-bold text-xl">{volume.toFixed(2)}</span>

                <button onClick={() => setVolume(volume + 0.01)} className="text-[#0a84ff] font-bold text-sm">+0.01</button>
                <button onClick={() => setVolume(volume + 0.1)} className="text-[#0a84ff] font-bold text-sm">+0.1</button>
                <button onClick={() => setVolume(volume + 0.5)} className="text-[#0a84ff] font-bold text-sm">+0.5</button>
            </div>

            {/* Big Price Tickers */}
            <div className="flex justify-between px-8 mb-4">
                {/* Bid */}
                <div className="flex flex-col items-center">
                    <div className={`flex items-baseline ${bid < currentBid ? 'text-[#ff3b30]' : 'text-[#ff3b30]'}`}>
                        {/* Always Red side roughly per screenshot */}
                        <span className="text-2xl font-bold">{bidParts.small}</span>
                        <span className="text-5xl font-bold mx-1">{bidParts.big}</span>
                        <span className="text-lg font-bold align-top mt-1">{bidParts.sup}</span>
                    </div>
                </div>

                {/* Ask */}
                <div className="flex flex-col items-center">
                    <div className={`flex items-baseline ${ask > currentAsk ? 'text-[#0a84ff]' : 'text-[#ff3b30]'}`}>
                        {/* Actually in screenshot ask is red too? Wait, usually Ask is blue/green. 
                            Let's follow standard MT4/5: Sell is Red, Buy is Blue. 
                            Screenshot 2 shows both Red. But that might be a specific market moment.
                            I will stick to Red/Blue for clarity unless requested otherwise.
                        */}
                        <span className="text-2xl font-bold text-[#ff3b30]">{askParts.small}</span>
                        <span className="text-5xl font-bold mx-1 text-[#ff3b30]">{askParts.big}</span>
                        <span className="text-lg font-bold align-top mt-1 text-[#ff3b30]">{askParts.sup}</span>
                    </div>
                </div>
            </div>

            {/* Inputs */}
            <div className="flex justify-between px-8 mb-4 text-center">
                <div className="flex items-center space-x-4">
                    <span className="text-[#0a84ff] font-bold text-xl">-</span>
                    <span className="text-white font-bold text-sm border-b border-[#3a3a3c] pb-1 min-w-[50px] text-center">SL</span>
                    <span className="text-[#0a84ff] font-bold text-xl">+</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-[#0a84ff] font-bold text-xl">-</span>
                    <span className="text-white font-bold text-sm border-b border-[#3a3a3c] pb-1 min-w-[50px] text-center">TP</span>
                    <span className="text-[#0a84ff] font-bold text-xl">+</span>
                </div>
            </div>

            {/* Chart Area (SVG) */}
            <div className="flex-1 w-full relative mb-4 mt-4 border-t border-dashed border-[#3a3a3c]">
                <svg className="w-full h-full" preserveAspectRatio="none">
                    <polyline
                        points={tickHistory.map((p, i) => `${i * (100 / 50)},${100 - ((p - (currentBid - 0.001)) / 0.002 * 100)}`).join(' ')}
                        fill="none"
                        stroke={chartColor}
                        strokeWidth="1.5"
                    />
                    {/* Horizontal Lines */}
                    <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#333" strokeDasharray="4" strokeWidth="1" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#333" strokeDasharray="4" strokeWidth="1" />
                    <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#333" strokeDasharray="4" strokeWidth="1" />
                </svg>
                {/* Price Label on Chart Right */}
                <div className="absolute right-0 top-[65%] bg-[#ff3b30] text-white text-[10px] px-1 rounded-l">
                    {bid.toFixed(5)}
                </div>
                <div className="absolute right-0 top-[60%] bg-[#0a84ff] text-white text-[10px] px-1 rounded-l">
                    {ask.toFixed(5)}
                </div>
            </div>

            {/* Buy/Sell Buttons */}
            <div className="grid grid-cols-2 gap-0 mt-auto mb-8 relative">
                {/* Divider */}
                <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-[#3a3a3c]"></div>

                <div className="px-6">
                    <div
                        onClick={() => onPlaceOrder('sell', volume, bid)}
                        className="text-center cursor-pointer active:opacity-70"
                    >
                        <div className="text-[#ff3b30] font-bold text-lg mb-1">SELL</div>
                        <div className="text-[#ff3b30] text-xs font-bold">BY MARKET</div>
                    </div>
                </div>

                <div className="px-6">
                    <div
                        onClick={() => onPlaceOrder('buy', volume, ask)}
                        className="text-center cursor-pointer active:opacity-70"
                    >
                        <div className="text-[#0a84ff] font-bold text-lg mb-1">BUY</div>
                        <div className="text-[#0a84ff] text-xs font-bold">BY MARKET</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewOrderPage;
