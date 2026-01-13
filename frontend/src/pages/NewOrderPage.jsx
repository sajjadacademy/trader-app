import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const NewOrderPage = ({ symbol = 'EURUSD', onClose, onPlaceOrder, currentBid = 1.16413, currentAsk = 1.16416 }) => {

    const [volume, setVolume] = useState(0.01);

    // Simulation state
    const [bid, setBid] = useState(currentBid);
    const [ask, setAsk] = useState(currentAsk);
    const [tickHistory, setTickHistory] = useState([]);

    // Simulate tick movement (Step Chart style)
    useEffect(() => {
        // Init history
        let p = currentBid;
        const initialPoints = Array(60).fill(0).map((_, i) => {
            if (i > 40) p += (Math.random() - 0.5) * 0.0002; // Movement at end
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
        }, 800);
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

    // SVG Path Generator for Step Chart
    const generateStepPath = (offset = 0) => {
        if (tickHistory.length < 2) return { d: "", min: 0, max: 0, lastY: 50 };
        const max = Math.max(...tickHistory, currentBid + 0.0004) + 0.0001;
        const min = Math.min(...tickHistory, currentBid - 0.0004) - 0.0001;
        const range = max - min;

        let d = `M 0,${100 - ((tickHistory[0] + offset - min) / range * 100)}`;

        tickHistory.forEach((p, i) => {
            if (i === 0) return;
            const x = (i / (tickHistory.length - 1)) * 100;
            const y = 100 - ((p + offset - min) / range * 100);

            // Step: Horizontal then Vertical
            d += ` L ${x},${100 - ((tickHistory[i - 1] + offset - min) / range * 100)}`;
            d += ` L ${x},${y}`;
        });

        // Add final horizontal line to edge
        const lastY = 100 - ((tickHistory[tickHistory.length - 1] + offset - min) / range * 100);
        d += ` L 100,${lastY}`;

        return { d, min, max, lastY };
    };

    const bidPathData = generateStepPath(0);
    const askPathData = generateStepPath(ask - bid);

    return (
        <div className="flex flex-col h-full bg-black text-white font-sans select-none">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-black">
                <button onClick={onClose}><ArrowLeft size={22} className="text-white" /></button>
                <div className="flex flex-col items-center">
                    <h1 className="text-[15px] font-bold text-white tracking-wide">{symbol}</h1>
                    <span className="text-[10px] text-[#8e8e93]">Euro vs US Dollar</span>
                </div>
                <button><RefreshCw size={20} className="text-white" /></button>
            </div>

            {/* Market Execution Box */}
            <div className="mx-4 mt-2 mb-6">
                <div className="w-full border border-[#3a3a3c] rounded p-2 text-center text-sm font-normal relative bg-black cursor-pointer active:bg-[#1c1c1e]">
                    Market Execution
                    <div className="absolute right-0 bottom-0 w-1.5 h-1.5 bg-white transform rotate-45 translate-x-0.5 translate-y-0.5"></div>
                </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-between px-2 mb-6 mt-4">
                <div className="flex space-x-5">
                    <button onClick={() => setVolume(Math.max(0.01, volume - 0.5))} className="text-[#0a84ff] text-sm font-medium">-0.5</button>
                    <button onClick={() => setVolume(Math.max(0.01, volume - 0.1))} className="text-[#0a84ff] text-sm font-medium">-0.1</button>
                    <button onClick={() => setVolume(Math.max(0.01, volume - 0.01))} className="text-[#0a84ff] text-sm font-medium">-0.01</button>
                </div>

                <span className="text-white font-bold text-xl tracking-wider">{volume.toFixed(2)}</span>

                <div className="flex space-x-5">
                    <button onClick={() => setVolume(volume + 0.01)} className="text-[#0a84ff] text-sm font-medium">+0.01</button>
                    <button onClick={() => setVolume(volume + 0.1)} className="text-[#0a84ff] text-sm font-medium">+0.1</button>
                    <button onClick={() => setVolume(volume + 0.5)} className="text-[#0a84ff] text-sm font-medium">+0.5</button>
                </div>
            </div>

            {/* Big Tickers */}
            <div className="flex justify-between px-8 mb-6">
                {/* BID (Sell Price) - Left */}
                <div className="flex items-start text-[#ff3b30]">
                    <span className="text-[28px] leading-none mt-1.5 font-normal">{bidParts.small}</span>
                    <span className="text-[54px] leading-none font-normal mx-0.5">{bidParts.big}</span>
                    <span className="text-[18px] leading-none mt-1 font-normal">{bidParts.sup}</span>
                </div>

                {/* ASK (Buy Price) - Right */}
                <div className="flex items-start text-[#ff3b30]">
                    <span className="text-[28px] leading-none mt-1.5 font-normal">{askParts.small}</span>
                    <span className="text-[54px] leading-none font-normal mx-0.5">{askParts.big}</span>
                    <span className="text-[18px] leading-none mt-1 font-normal">{askParts.sup}</span>
                </div>
            </div>

            {/* SL / TP Row */}
            <div className="flex px-4 space-x-8 mb-4">
                <div className="flex-1 flex items-center">
                    <button className="text-[#0a84ff] text-xl px-3 font-light">-</button>
                    <div className="flex-1 text-center border-b border-[#3a3a3c] text-[#8e8e93] text-sm pb-1">SL</div>
                    <button className="text-[#0a84ff] text-xl px-3 font-light">+</button>
                </div>
                <div className="flex-1 flex items-center">
                    <button className="text-[#0a84ff] text-xl px-3 font-light">-</button>
                    <div className="flex-1 text-center border-b border-[#3a3a3c] text-[#8e8e93] text-sm pb-1">TP</div>
                    <button className="text-[#0a84ff] text-xl px-3 font-light">+</button>
                </div>
            </div>

            <div className="flex px-4 space-x-8 mb-1">
                <div className="flex-1 flex items-center justify-between border-b border-[#3a3a3c] pb-1 mx-3">
                    <span className="text-[#8e8e93] text-xs">Fill policy</span>
                    <span className="text-white text-xs">Fill or Kill</span>
                </div>
            </div>


            {/* Chart Area */}
            <div className="flex-1 w-full relative mt-2 border-t border-dashed border-[#3a3a3c]/30">
                {/* Horizontal Grid */}
                <div className="absolute inset-0 flex flex-col justify-evenly pointer-events-none">
                    <div className="border-t border-dashed border-[#3a3a3c]/30 w-full h-px"></div>
                    <div className="border-t border-dashed border-[#3a3a3c]/30 w-full h-px"></div>
                </div>
                {/* Right Axis Labels */}
                <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-2 text-[#8e8e93] text-[9px] pr-1 z-0">
                    <span>{bidPathData.max.toFixed(5)}</span>
                    <span>{bidPathData.min.toFixed(5)}</span>
                </div>

                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Ask Line (Red) - Top Line */}
                    <path
                        d={askPathData.d}
                        fill="none"
                        stroke="#ff3b30"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                    />
                    {/* Bid Line (Blue) - Bottom Line */}
                    <path
                        d={bidPathData.d}
                        fill="none"
                        stroke="#0a84ff"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>

                {/* Specific Price Cards (Tags) */}
                {/* Red Card/Line for Ask */}
                <div
                    className="absolute right-0 bg-[#ff3b30] text-white text-[10px] px-1 py-0.5 leading-none transition-all duration-300 z-10"
                    style={{ top: `${askPathData.lastY}%`, transform: 'translateY(-50%)' }}
                >
                    {ask.toFixed(5)}
                </div>
                {/* Horizontal line extension for Red */}
                <div
                    className="absolute right-0 w-full border-t border-[#ff3b30] opacity-50 transition-all duration-300 pointer-events-none"
                    style={{ top: `${askPathData.lastY}%` }}
                ></div>

                {/* Blue Card/Line for Bid */}
                <div
                    className="absolute right-0 bg-[#0a84ff] text-white text-[10px] px-1 py-0.5 leading-none transition-all duration-300 z-10"
                    style={{ top: `${bidPathData.lastY}%`, transform: 'translateY(-50%)' }}
                >
                    {bid.toFixed(5)}
                </div>
                {/* Horizontal line extension for Blue */}
                <div
                    className="absolute right-0 w-full border-t border-[#0a84ff] opacity-50 transition-all duration-300 pointer-events-none"
                    style={{ top: `${bidPathData.lastY}%` }}
                ></div>
            </div>

            {/* Disclaimer */}
            <div className="px-4 text-center mt-2 mb-4">
                <p className="text-[9px] text-[#5c5c5e] leading-tight mx-4">
                    Attention! The trade will be executed at market conditions, difference with requested price may be significant!
                </p>
            </div>

            {/* Buy/Sell Buttons */}
            <div className="grid grid-cols-2 gap-0 mb-6 relative border-t border-[#3a3a3c]/30">
                {/* Vertical Divider */}
                <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-[#3a3a3c]"></div>

                <button
                    onClick={() => onPlaceOrder('sell', volume, bid)}
                    className="flex flex-col items-center justify-center p-3 active:bg-[#1c1c1e] transition-colors"
                >
                    <span className="text-[#ff3b30] font-bold text-[15px]">SELL</span>
                    <span className="text-[#ff3b30] text-[10px] font-bold uppercase mt-0.5">BY MARKET</span>
                </button>

                <button
                    onClick={() => onPlaceOrder('buy', volume, ask)}
                    className="flex flex-col items-center justify-center p-3 active:bg-[#1c1c1e] transition-colors"
                >
                    <span className="text-[#0a84ff] font-bold text-[15px]">BUY</span>
                    <span className="text-[#0a84ff] text-[10px] font-bold uppercase mt-0.5">BY MARKET</span>
                </button>
            </div>
        </div>
    );
};

export default NewOrderPage;
