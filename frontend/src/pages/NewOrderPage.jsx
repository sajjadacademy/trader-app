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
            if (i > 40) p += (Math.random() - 0.5) * 0.0002;
            return p;
        });
        setTickHistory(initialPoints);

        const interval = setInterval(() => {
            setBid(prev => {
                const move = (Math.random() - 0.5) * 0.0001;
                const next = prev + move;
                setAsk(next + 0.00003);

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

        // Scale factor: compress history to the left (e.g. 20% of width)
        const scaleX = 0.25;

        let d = `M 0,${100 - ((tickHistory[0] + offset - min) / range * 100)}`;

        tickHistory.forEach((p, i) => {
            if (i === 0) return;
            // X coordinates mapped to 0..25% range
            const x = (i / (tickHistory.length - 1)) * 100 * scaleX;
            const y = 100 - ((p + offset - min) / range * 100);

            // Step: Horizontal then Vertical
            d += ` L ${x},${100 - ((tickHistory[i - 1] + offset - min) / range * 100)}`;
            d += ` L ${x},${y}`;
        });

        // Final straight line extending from the "zigzag" end to the right edge (100%)
        const lastY = 100 - ((tickHistory[tickHistory.length - 1] + offset - min) / range * 100);
        d += ` L 100,${lastY}`;

        return { d, min, max, lastY };
    };

    // Generate paths
    const bidPathData = generateStepPath(0);
    const askPathData = generateStepPath(ask - bid);

    const tickerColor = "text-[#cc0000]";

    return (
        <div className="fixed inset-0 z-50 flex flex-col h-full bg-black text-white font-sans select-none overflow-hidden">
            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-black space-x-4 border-b border-transparent shrink-0">
                <button onClick={onClose}><ArrowLeft size={24} className="text-white" /></button>
                <div className="flex flex-col items-start flex-1">
                    <h1 className="text-xl font-bold text-white tracking-wide uppercase">{symbol}</h1>
                    <span className="text-[12px] text-[#8e8e93] mt-0.5">Euro vs US Dollar</span>
                </div>
                {/* Right side icons: $ inside circular arrows */}
                <div className="flex items-center justify-center w-8 h-8 relative">
                    <RefreshCw size={26} className="text-white" strokeWidth={1.5} />
                    <span className="absolute text-[12px] font-bold text-white pt-[1px]">$</span>
                </div>
            </div>

            {/* Market Execution */}
            <div className="mx-4 mt-1 shrink-0">
                <div className="w-full border-b border-[#3a3a3c] pb-2 flex justify-between items-center cursor-pointer active:bg-[#1c1c1e]">
                    <div className="w-4"></div>
                    <span className="text-base font-medium text-white">Market Execution</span>
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-t-[5px] border-t-[#8e8e93] border-r-[4px] border-r-transparent transform translate-y-0.5"></div>
                </div>
            </div>

            {/* Volume Control */}
            <div className="px-4 mt-4 mb-4 shrink-0">
                <div className="flex items-center justify-between pb-6 border-b border-[#3a3a3c]">
                    <div className="flex space-x-3">
                        <button onClick={() => setVolume(Math.max(0.01, volume - 0.5))} className="text-[#0a84ff] text-sm font-medium">-0.5</button>
                        <button onClick={() => setVolume(Math.max(0.01, volume - 0.1))} className="text-[#0a84ff] text-sm font-medium">-0.1</button>
                        <button onClick={() => setVolume(Math.max(0.01, volume - 0.01))} className="text-[#0a84ff] text-sm font-medium">-0.01</button>
                    </div>

                    <span className="text-white font-bold text-xl">{volume.toFixed(2)}</span>

                    <div className="flex space-x-3">
                        <button onClick={() => setVolume(volume + 0.01)} className="text-[#0a84ff] text-sm font-medium">+0.01</button>
                        <button onClick={() => setVolume(volume + 0.1)} className="text-[#0a84ff] text-sm font-medium">+0.1</button>
                        <button onClick={() => setVolume(volume + 0.5)} className="text-[#0a84ff] text-sm font-medium">+0.5</button>
                    </div>
                </div>
            </div>

            {/* Big Tickers */}
            <div className="flex justify-between px-8 mb-4 mt-1 shrink-0">
                {/* BID */}
                <div className={`flex items-start ${tickerColor}`}>
                    <span className="text-[34px] font-normal tracking-tight">{bidParts.small}</span>
                    <span className="text-[60px] font-normal leading-none -mt-1 mx-1">{bidParts.big}</span>
                    <span className="text-[22px] font-normal -mt-0">{bidParts.sup}</span>
                </div>

                {/* ASK */}
                <div className={`flex items-start ${tickerColor}`}>
                    <span className="text-[34px] font-normal tracking-tight">{askParts.small}</span>
                    <span className="text-[60px] font-normal leading-none -mt-1 mx-1">{askParts.big}</span>
                    <span className="text-[22px] font-normal -mt-0">{askParts.sup}</span>
                </div>
            </div>

            {/* SL / TP Row */}
            <div className="flex px-4 space-x-8 mb-2 shrink-0">
                <div className="flex-1 flex items-center justify-between">
                    <button className="text-[#0a84ff] text-2xl px-2 font-light">-</button>
                    <div className="flex-1 text-center text-[#8e8e93] text-sm pb-1 mx-2">
                        SL
                    </div>
                    <button className="text-[#0a84ff] text-2xl px-2 font-light">+</button>
                </div>

                <div className="flex-1 flex items-center justify-between">
                    <button className="text-[#0a84ff] text-2xl px-2 font-light">-</button>
                    <div className="flex-1 text-center text-[#8e8e93] text-sm pb-1 mx-2">
                        TP
                    </div>
                    <button className="text-[#0a84ff] text-2xl px-2 font-light">+</button>
                </div>
            </div>

            {/* Fill Policy */}
            <div className="flex px-6 space-x-4 mb-2 mt-4 shrink-0">
                <div className="flex-1 flex items-center justify-between border-b border-[#3a3a3c] pb-2">
                    <span className="text-[#8e8e93] text-sm">Fill policy</span>
                    <span className="text-white text-sm">Fill or Kill</span>
                </div>
            </div>


            {/* Chart Area - Flex Grow but min-h-0 to avoid overflow */}
            <div className="flex-1 w-full relative mt-2 min-h-0">
                {/* 3 Dashed Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-center space-y-12 pointer-events-none px-0">
                    <div className="border-t border-dotted border-[#3a3a3c] w-full h-px relative">
                        <span className="absolute right-0 -top-2 text-[10px] text-[#8e8e93] bg-black px-1">
                            {(askPathData.max - 0.0001).toFixed(5)}
                        </span>
                    </div>
                    <div className="border-t border-dotted border-[#3a3a3c] w-full h-px relative">
                        <span className="absolute right-0 -top-2 text-[10px] text-[#8e8e93] bg-black px-1">
                            {(askPathData.max - 0.0003).toFixed(5)}
                        </span>
                    </div>
                    <div className="border-t border-dotted border-[#3a3a3c] w-full h-px relative">
                        <span className="absolute right-0 -top-2 text-[10px] text-[#8e8e93] bg-black px-1">
                            {(askPathData.min + 0.0001).toFixed(5)}
                        </span>
                    </div>
                </div>

                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Ask Line (Red) */}
                    <path
                        d={askPathData.d}
                        fill="none"
                        stroke="#ff3b30"
                        strokeWidth="1.2"
                        vectorEffect="non-scaling-stroke"
                    />
                    {/* Bid Line (Blue) */}
                    <path
                        d={bidPathData.d}
                        fill="none"
                        stroke="#0a84ff"
                        strokeWidth="1.2"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>

                {/* Price Cards */}
                <div
                    className="absolute right-0 bg-[#ff3b30] text-white text-[11px] px-1 py-0.5 leading-none z-10"
                    style={{ top: `${askPathData.lastY}%`, transform: 'translateY(-50%)' }}
                >
                    {ask.toFixed(5)}
                </div>

                <div
                    className="absolute right-0 bg-[#0a84ff] text-white text-[11px] px-1 py-0.5 leading-none z-10"
                    style={{ top: `${bidPathData.lastY}%`, transform: 'translateY(-50%)' }}
                >
                    {bid.toFixed(5)}
                </div>
            </div>

            {/* Attention Text */}
            <div className="px-6 text-center mb-4 mt-2 shrink-0">
                <p className="text-[13px] text-[#8e8e93] leading-snug">
                    Attention! The trade will be executed at market conditions, difference with requested price may be significant!
                </p>
            </div>

            {/* Buy/Sell Buttons - Fixed Bottom or end of flow */}
            <div className="grid grid-cols-2 gap-0 pb-6 relative border-t border-[#3a3a3c]/30 shrink-0 bg-black z-20">
                <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-[#3a3a3c]"></div>

                <button
                    onClick={() => onPlaceOrder('sell', volume, bid)}
                    className="flex flex-col items-center justify-center p-4 active:bg-[#1c1c1e] transition-colors"
                >
                    <span className="text-[#ff3b30] font-bold text-lg">SELL</span>
                    <span className="text-[#ff3b30] text-[11px] font-bold uppercase mt-1">BY MARKET</span>
                </button>

                <button
                    onClick={() => onPlaceOrder('buy', volume, ask)}
                    className="flex flex-col items-center justify-center p-4 active:bg-[#1c1c1e] transition-colors"
                >
                    <span className="text-[#0a84ff] font-bold text-lg">BUY</span>
                    <span className="text-[#0a84ff] text-[11px] font-bold uppercase mt-1">BY MARKET</span>
                </button>
            </div>
        </div>
    );
};

export default NewOrderPage;
