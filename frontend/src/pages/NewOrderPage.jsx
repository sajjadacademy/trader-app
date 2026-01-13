import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const NewOrderPage = ({ symbol = 'EURUSD', onClose, onPlaceOrder, currentBid = 1.16413, currentAsk = 1.16416 }) => {

    // Default volume per screenshot is 0.01
    const [volume, setVolume] = useState(0.01);

    // Simulation state
    const [bid, setBid] = useState(currentBid);
    const [ask, setAsk] = useState(currentAsk);
    const [tickHistory, setTickHistory] = useState([]);

    // Simulate tick movement (Step Chart style)
    useEffect(() => {
        // Init history with a slightly downward trend to match screenshot
        let p = currentBid;
        const initialPoints = Array(40).fill(0).map((_, i) => {
            p += (Math.random() - 0.6) * 0.0001; // slight down bias
            return p;
        });
        setTickHistory(initialPoints);

        const interval = setInterval(() => {
            setBid(prev => {
                const move = (Math.random() - 0.5) * 0.0001;
                const next = prev + move;
                setAsk(next + 0.00003); // Spread ~3 pips

                setTickHistory(h => {
                    const newH = [...h.slice(1), next];
                    return newH;
                });
                return next;
            });
        }, 1000); // Slower tick for stability
        return () => clearInterval(interval);
    }, []);

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
    const isDown = tickHistory[tickHistory.length - 1] < tickHistory[tickHistory.length - 10]; // Trend check

    // In screenshot, both are Red. Assuming market is down.
    // If we want dynamic: Red if down, Blue if up.
    // Let's stick to the user's "upset down" request: Blue for Up, Red for Down.
    const priceColor = isDown ? 'text-[#ff3b30]' : 'text-[#0a84ff]';

    // Helper for Volume Buttons
    const VolBtn = ({ val, onClick, label }) => (
        <button onClick={onClick} className="text-[#0a84ff] text-sm font-medium active:text-white transition-colors">
            {label}
        </button>
    );

    // SVG Path Generator for Step Chart
    const generateStepPath = () => {
        if (tickHistory.length < 2) return "";
        const max = Math.max(...tickHistory, currentBid + 0.0005);
        const min = Math.min(...tickHistory, currentBid - 0.0005);
        const range = max - min;
        const width = 100; // SVG viewBox percentage
        const height = 100;

        let d = `M 0,${100 - ((tickHistory[0] - min) / range * 100)}`;

        tickHistory.forEach((p, i) => {
            if (i === 0) return;
            const x = (i / (tickHistory.length - 1)) * width;
            const y = 100 - ((p - min) / range * 100);
            const prevX = ((i - 1) / (tickHistory.length - 1)) * width;
            // Step Logic: Draw Horizontal -> Then Vertical
            d += ` L ${x},${100 - ((tickHistory[i - 1] - min) / range * 100)}`; // Horizontal to new X
            d += ` L ${x},${y}`; // Vertical to new Y
        });

        return { d, min, max };
    };

    const { d, min, max } = generateStepPath();

    return (
        <div className="flex flex-col h-full bg-black text-white font-sans select-none">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black">
                <button onClick={onClose}><ArrowLeft size={24} className="text-white" /></button>
                <div className="flex flex-col items-center">
                    <h1 className="text-base font-bold text-white tracking-wide">{symbol}</h1>
                    <span className="text-[10px] text-[#8e8e93]">Euro vs US Dollar</span>
                </div>
                <button><RefreshCw size={20} className="text-white" /></button>
            </div>

            {/* Market Execution Label */}
            <div className="flex justify-center mt-2 relative mx-4">
                <div className="w-full border border-[#3a3a3c] rounded p-2 text-center text-sm font-medium relative bg-black z-10">
                    Market Execution
                    {/* Tiny corner triangle */}
                    <div className="absolute right-0 bottom-0 w-2 h-2 bg-white transform rotate-45 translate-x-1 translate-y-1"></div>
                </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-between px-2 mt-6 mb-4">
                <div className="flex space-x-4">
                    <VolBtn label="-0.5" onClick={() => setVolume(Math.max(0.01, volume - 0.5))} />
                    <VolBtn label="-0.1" onClick={() => setVolume(Math.max(0.01, volume - 0.1))} />
                    <VolBtn label="-0.01" onClick={() => setVolume(Math.max(0.01, volume - 0.01))} />
                </div>

                <span className="text-white font-bold text-xl">{volume.toFixed(2)}</span>

                <div className="flex space-x-4">
                    <VolBtn label="+0.01" onClick={() => setVolume(volume + 0.01)} />
                    <VolBtn label="+0.1" onClick={() => setVolume(volume + 0.1)} />
                    <VolBtn label="+0.5" onClick={() => setVolume(volume + 0.5)} />
                </div>
            </div>

            {/* Big Tickers */}
            <div className="flex justify-between px-10 mb-8 mt-2">
                {/* BID */}
                <div className={`flex items-start ${priceColor}`}>
                    <span className="text-3xl font-medium tracking-tighter">{bidParts.small}</span>
                    <span className="text-6xl font-bold leading-none -mt-1">{bidParts.big}</span>
                    <span className="text-xl font-medium -mt-0">{bidParts.sup}</span>
                </div>

                {/* ASK */}
                <div className={`flex items-start ${priceColor}`}>
                    <span className="text-3xl font-medium tracking-tighter">{askParts.small}</span>
                    <span className="text-6xl font-bold leading-none -mt-1">{askParts.big}</span>
                    <span className="text-xl font-medium -mt-0">{askParts.sup}</span>
                </div>
            </div>

            {/* SL / TP Row */}
            <div className="flex px-4 space-x-8 mb-4">
                {/* SL */}
                <div className="flex-1 flex items-center justify-between">
                    <button className="text-[#0a84ff] text-xl font-bold px-2">-</button>
                    <div className="flex-1 text-center border-b border-[#3a3a3c] text-white text-sm font-medium pb-1 mx-2">
                        SL
                    </div>
                    <button className="text-[#0a84ff] text-xl font-bold px-2">+</button>
                </div>

                {/* TP */}
                <div className="flex-1 flex items-center justify-between">
                    <button className="text-[#0a84ff] text-xl font-bold px-2">-</button>
                    <div className="flex-1 text-center border-b border-[#3a3a3c] text-white text-sm font-medium pb-1 mx-2">
                        TP
                    </div>
                    <button className="text-[#0a84ff] text-xl font-bold px-2">+</button>
                </div>
            </div>

            {/* Fill Policy */}
            <div className="flex px-6 space-x-4 mb-2">
                <div className="flex-1 flex items-center justify-between border-b border-[#3a3a3c] pb-1">
                    <span className="text-[#8e8e93] text-xs">Fill policy</span>
                    <span className="text-white text-xs">Fill or Kill</span>
                </div>
            </div>


            {/* Chart Area */}
            <div className="flex-1 w-full relative border-t border-dashed border-[#3a3a3c]/50 mt-2">
                {/* Y Axis Labels */}
                <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-4 pointer-events-none z-10">
                    <span className="text-[9px] text-[#8e8e93] px-1">{max.toFixed(5)}</span>
                    <span className="text-[9px] text-[#8e8e93] px-1">{(max - (max - min) / 2).toFixed(5)}</span>
                    <span className="text-[9px] text-[#8e8e93] px-1">{min.toFixed(5)}</span>
                </div>

                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-evenly pointer-events-none">
                    <div className="border-t border-dashed border-[#3a3a3c]/30 w-full h-px"></div>
                    <div className="border-t border-dashed border-[#3a3a3c]/30 w-full h-px"></div>
                </div>

                {/* The Chart */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Ask Line (Red) - using simulation noise offset */}
                    <path
                        d={d /* Use same path for both but offset? For now simple single line is cleaner visually in React SVG without d3 */}
                        fill="none"
                        stroke={isDown ? '#ff3b30' : '#0a84ff'}
                        strokeWidth="1.2"
                        vectorEffect="non-scaling-stroke"
                    />
                    {/* Bid Line (Blue) - Just duplicate with slight offset y for visual spread effect if desired, but user screenshot shows intertwined lines */}
                    <path
                        d={d.replace(/,(\d+)/g, (match, y) => `,${parseFloat(y) + 2}`)} // Simple offset hack
                        fill="none"
                        stroke={isDown ? '#ff3230' : '#0070eb'}
                        strokeWidth="1.2"
                        strokeOpacity="0.6"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>

                {/* Price Labels floating on right */}
                <div
                    className="absolute right-0 bg-[#ff3b30] text-white text-[9px] px-1 transition-all duration-300"
                    style={{ top: '60%' }} // Fixed pos for demo
                >
                    {bid.toFixed(5)}
                </div>
                <div
                    className="absolute right-0 bg-[#0a84ff] text-white text-[9px] px-1 transition-all duration-300"
                    style={{ top: '65%' }}
                >
                    {ask.toFixed(5)}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="px-4 text-center mb-6 mt-2">
                <p className="text-[10px] text-[#8e8e93] leading-tight">
                    Attention! The trade will be executed at market conditions, difference with requested price may be significant!
                </p>
            </div>

            {/* Buy/Sell Buttons */}
            <div className="grid grid-cols-2 gap-0 mb-6 relative">
                {/* Center Divider Line */}
                <div className="absolute left-1/2 top-2 bottom-2 w-[1px] bg-[#3a3a3c]"></div>

                <button
                    onClick={() => onPlaceOrder('sell', volume, bid)}
                    className="flex flex-col items-center justify-center p-4 active:bg-[#1c1c1e] transition-colors"
                >
                    <span className="text-[#ff3b30] font-bold text-base">SELL</span>
                    <span className="text-[#ff3b30] text-[10px] font-bold uppercase">BY MARKET</span>
                </button>

                <button
                    onClick={() => onPlaceOrder('buy', volume, ask)}
                    className="flex flex-col items-center justify-center p-4 active:bg-[#1c1c1e] transition-colors"
                >
                    <span className="text-[#0a84ff] font-bold text-base">BUY</span>
                    <span className="text-[#0a84ff] text-[10px] font-bold uppercase">BY MARKET</span>
                </button>
            </div>
        </div>
    );
};

export default NewOrderPage;
