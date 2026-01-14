import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, FileText, Menu, Files } from 'lucide-react';

const ClosePositionScreen = ({ trade, onClose, onConfirmClose }) => {
    const [step, setStep] = useState('confirm'); // confirm, processing, done

    // -------------------------------------------------------------------------
    // DYNAMIC CHART LOGIC
    // -------------------------------------------------------------------------
    // We keep a history of "ticks" for the chart.
    // Each tick has { time, bid, ask }
    const [ticks, setTicks] = useState([]);
    const maxTicks = 40; // How many points to show on chart

    // Initialize ticks on mount
    useEffect(() => {
        const initialTicks = [];
        let runningBid = trade.currentPrice || trade.price;
        const spread = 0.00003; // Fixed spread for visual clarity

        for (let i = 0; i < maxTicks; i++) {
            // Create some random noise for initial history
            runningBid += (Math.random() - 0.5) * 0.00005;
            initialTicks.push({
                bid: runningBid,
                ask: runningBid + spread
            });
        }
        setTicks(initialTicks);
    }, []);

    // Simulate live price updates
    useEffect(() => {
        if (step !== 'confirm') return; // Stop simulating if processing/done

        const interval = setInterval(() => {
            setTicks(prev => {
                const last = prev[prev.length - 1];
                if (!last) return prev;

                // Random walk
                const change = (Math.random() - 0.5) * 0.00005;
                const newBid = last.bid + change;
                const spread = 0.00003; // Keep constant spread for parallel lines look

                const newTick = { bid: newBid, ask: newBid + spread };
                // Keep only last N ticks
                return [...prev.slice(1), newTick];
            });
        }, 300); // Fast tick update

        return () => clearInterval(interval);
    }, [step]);

    // Calculate Y-scale for the chart
    // We need min/max of the current view to auto-scale
    const allBids = ticks.map(t => t.bid);
    const allAsks = ticks.map(t => t.ask);
    const minPrice = Math.min(...allBids);
    const maxPrice = Math.max(...allAsks);
    const padding = (maxPrice - minPrice) * 0.5; // Add vertical breathing room
    const yMin = minPrice - padding;
    const yMax = maxPrice + padding;

    // Helper to map price to Y-coordinate (0 to 100%)
    const getY = (price) => {
        if (yMax === yMin) return 50; // Avoid divide by zero
        return 100 - ((price - yMin) / (yMax - yMin)) * 100;
    };

    // Generate SVG Paths
    const getPath = (dataKey) => {
        if (ticks.length === 0) return "";

        // 1. Generate the zigzag part (0% to 20%)
        const pathSegments = ticks.map((tick, i) => {
            const x = (i / (maxTicks - 1)) * 20;
            const y = getY(tick[dataKey]);
            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
        }).join(" ");

        // 2. Append the flat line extension (20% to 100%)
        // This ensures the line is mathematically continuous with 0 gaps
        const lastTick = ticks[ticks.length - 1];
        const lastY = getY(lastTick[dataKey]); // 0-100 range due to viewBox="0 0 100 100"

        return `${pathSegments} L 100,${lastY}`;
    };

    // Current live prices for display
    const currentTick = ticks[ticks.length - 1] || { bid: trade.currentPrice, ask: trade.currentPrice + 0.00003 };
    const currentBidY = getY(currentTick.bid);
    const currentAskY = getY(currentTick.ask);

    // -------------------------------------------------------------------------

    useEffect(() => {
        if (step === 'processing') {
            const timer = setTimeout(() => {
                setStep('done');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Handle "Done" button click
    const handleDone = () => {
        onConfirmClose(trade);
        onClose();
    };

    if (step === 'done') {
        return (
            <div className="fixed inset-0 z-[60] bg-black flex flex-col font-sans">
                {/* Header matching screenshot */}
                <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center">
                        <Menu className="text-[#e1e1e1] mr-6" size={24} />
                        <h1 className="text-[19px] font-normal text-[#e1e1e1] tracking-normal">Close position</h1>
                    </div>
                    {/* Copy/Files Icon matching header color */}
                    <Files className="text-[#e1e1e1]" size={24} />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center pb-32">
                    {/* Custom Icon: Green Circle -> Black File -> Green Check */}
                    <div className="w-28 h-28 rounded-full bg-[#87c58e] flex items-center justify-center mb-6">
                        {/* Black File Shape */}
                        <div className="w-12 h-16 bg-black rounded-sm flex items-center justify-center relative">
                            {/* Folded corner detail: using a gradient or darker shade to simulate the fold flap */}
                            <div className="absolute top-0 right-0 w-4 h-4 bg-[#87c58e]"></div>
                            {/* The Flap itself */}
                            <div className="absolute top-0 right-0 w-4 h-4 bg-black/40 rounded-bl-sm"></div>

                            {/* Green Checkmark inside the file */}
                            <Check size={28} className="text-[#87c58e] mt-2 ml-0.5" strokeWidth={4} />
                        </div>
                    </div>

                    <h2 className="text-[26px] text-white font-bold mb-4">Done</h2>

                    <div className="flex flex-col items-center text-sm space-y-1">
                        {/* Line 1: SIDE VOLUME / VOLUME */}
                        <div className="flex items-center gap-1.5 text-base">
                            {/* Closing a Buy = SELL (Red). Closing a Sell = BUY (Blue). */}
                            <span className={trade.type === 'buy' ? 'text-[#ff3b30] font-bold' : 'text-[#0a84ff] font-bold'}>
                                {trade.type === 'buy' ? 'SELL' : 'BUY'}
                            </span>
                            <span className="text-white font-bold text-sm tracking-wide">
                                {trade.volume.toFixed(2)} / {trade.volume.toFixed(2)}
                            </span>
                        </div>

                        {/* Line 2: Symbol at Price */}
                        <div className="text-[#8e8e93] text-[15px] font-medium">
                            {trade.symbol} at {currentTick.bid.toFixed(5)}
                        </div>

                        {/* Line 3: ID */}
                        <div className="text-[#8e8e93] text-[15px] font-medium">#{trade.id}</div>
                    </div>
                </div>

                <div className="absolute bottom-0 w-full bg-[#2c2c2e]">
                    <button
                        onClick={handleDone}
                        className="w-full py-4 text-white text-sm font-bold uppercase tracking-wider bg-transparent"
                    >
                        DONE
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'processing') {
        return (
            <div className="fixed inset-0 z-[60] bg-black flex flex-col font-sans">
                {/* Header matching screenshot */}
                <div className="flex items-center px-4 py-4">
                    <Menu className="text-gray-400 mr-6" size={24} />
                    <h1 className="text-xl font-medium text-white tracking-tight">Close position</h1>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center pb-20">
                    {/* Custom Icon: Blue Circle -> Black File -> Blue Spinner */}
                    <div className="w-28 h-28 rounded-full bg-[#0a84ff] flex items-center justify-center mb-8">
                        {/* Black File Shape */}
                        <div className="w-12 h-16 bg-black rounded-sm flex items-center justify-center relative">
                            {/* Folded corner effect (optional but nice detail) */}
                            <div className="absolute top-0 right-0 w-4 h-4 bg-[#0a84ff] rounded-bl-sm"></div>

                            {/* Blue Spinner inside the file */}
                            <div className="w-6 h-6 border-[3px] border-[#0a84ff] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>

                    <h2 className="text-[22px] text-white font-bold mb-2 text-center leading-tight">
                        Order has been placed in queue...
                    </h2>
                    <div className="flex flex-col items-center text-[#8e8e93] text-[13px] font-sans">
                        <span>
                            market #{trade.id} {trade.type === 'buy' ? 'SELL' : 'BUY'} {trade.symbol} at {trade.currentPrice.toFixed(5)}
                        </span>
                    </div>
                </div>

                <div className="absolute bottom-0 w-full bg-[#2c2c2e]">
                    <button
                        onClick={onClose}
                        className="w-full py-4 text-white text-sm font-bold uppercase tracking-wider bg-transparent"
                    >
                        HIDE
                    </button>
                </div>
            </div>
        );
    }

    // Default: Confirm Step
    // Parse current simulated price for main display
    const priceStr = currentTick.bid.toFixed(5);
    const bigPart = priceStr.slice(0, 4); // 1.16
    const midPart = priceStr.slice(4, 6); // 43
    const smallPart = priceStr.slice(6);  // 3

    return (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col font-sans">
            {/* Header */}
            <div className="flex items-center px-4 py-3 border-b border-[#2c2c2e]">
                <button onClick={onClose} className="mr-6">
                    <ArrowLeft className="text-white" size={24} strokeWidth={2.5} />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-white tracking-wide">Close position #{trade.id}</h1>
                    <span className="text-xs text-gray-500 font-medium tracking-wide">
                        {trade.type} {trade.volume.toFixed(2)} {trade.symbol} at {trade.price.toFixed(5)}
                    </span>
                </div>
            </div>

            {/* Scale/Ruler for Lot Size? (The -0.5 ... +0.5 numbers from screenshot) */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <span className="text-gray-500 text-sm font-medium">-0.5</span>
                <span className="text-gray-500 text-sm font-medium">-0.1</span>
                <span className="text-gray-500 text-sm font-medium">-0.01</span>
                <span className="text-white font-bold text-xl">{trade.volume.toFixed(2)}</span>
                <span className="text-gray-500 text-sm font-medium">+0.01</span>
                <span className="text-gray-500 text-sm font-medium">+0.1</span>
                <span className="text-gray-500 text-sm font-medium">+0.5</span>
            </div>
            {/* Underline for Volume */}
            <div className="mx-4 border-b border-[#333] mb-4"></div>


            {/* Price Display Large */}
            <div className="flex justify-center items-start gap-12 py-4">
                {/* Left Price (Bid - Blue) */}
                <div className="flex items-start text-[#0a84ff] tracking-normal">
                    <span className="text-[28px]">{bigPart}</span>
                    <span className="text-[38px] font-bold mx-[1px] leading-none">{midPart}</span>
                    <sup className="text-lg font-bold top-2 relative">{smallPart}</sup>
                </div>
                {/* Right Price (Ask - Red) */}
                <div className="flex items-start text-[#eb4d3d] tracking-normal">
                    <span className="text-[28px]">{bigPart}</span>
                    <span className="text-[38px] font-bold mx-[1px] leading-none">{midPart}</span>
                    <sup className="text-lg font-bold top-2 relative">{parseInt(smallPart) + 3}</sup>
                </div>
            </div>

            {/* SL / TP Row */}
            <div className="flex justify-between px-8 py-2 mb-2 items-center text-gray-400">
                {/* SL Control */}
                <div className="flex gap-8 items-center">
                    <span className="text-2xl font-bold bg-[#1c1c1e] w-8 h-8 flex items-center justify-center rounded pb-1">-</span>
                    <span className="text-sm font-bold text-[#a0a0a0]">SL</span>
                    <span className="text-2xl font-bold bg-[#1c1c1e] w-8 h-8 flex items-center justify-center rounded pb-1">+</span>
                </div>
                {/* TP Control */}
                <div className="flex gap-8 items-center">
                    <span className="text-2xl font-bold bg-[#1c1c1e] w-8 h-8 flex items-center justify-center rounded pb-1">-</span>
                    <span className="text-sm font-bold text-[#a0a0a0]">TP</span>
                    <span className="text-2xl font-bold bg-[#1c1c1e] w-8 h-8 flex items-center justify-center rounded pb-1">+</span>
                </div>
            </div>

            {/* Fill Policy Row */}
            <div className="flex justify-between px-4 py-2 border-b border-[#2c2c2e] mb-2 relative z-10 bg-black">
                <span className="text-[#666] text-base">Fill policy</span>
                <span className="text-[#666] text-base">Fill or Kill</span>
                {/* Small indicator tick in bottom right */}
                <div className="absolute right-0 bottom-0 w-0 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-[#333]"></div>
            </div>

            {/* DYNAMIC CHART SVG Area */}
            {/* Added viewBox="0 0 100 100" to normalize coordinates to percentages */}
            <div className="flex-1 bg-black relative w-full overflow-hidden flex flex-col justify-center">

                {/* Background Grid Lines */}
                <div className="w-full absolute top-[20%] border-t border-dashed border-[#333]"></div>
                <div className="w-full absolute top-[40%] border-t border-dashed border-[#333]"></div>
                <div className="w-full absolute top-[60%] border-t border-dashed border-[#333]"></div>
                <div className="w-full absolute top-[80%] border-t border-dashed border-[#333]"></div>


                {/* Chart SVG */}
                <svg
                    className="w-full h-full absolute inset-0 pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    {/* ASK Line (Red) */}
                    <path
                        d={getPath('ask')}
                        fill="none"
                        stroke="#eb4d3d"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                    />
                    {/* BID Line (Blue) */}
                    <path
                        d={getPath('bid')}
                        fill="none"
                        stroke="#0a84ff"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                    />
                    {/* Note: Connection 'flat lines' are now part of getPath, so no separate <line> needed */}
                </svg>

                {/* Price Badges (Absolute positioned on right, tracking Y) */}
                {/* Ask Badge (Red) */}
                <div
                    className="absolute right-0 px-2 py-0.5 z-20 transition-all duration-300 ease-out flex items-center"
                    style={{ top: `${currentAskY}%`, transform: 'translateY(-50%)', backgroundColor: '#eb4d3d' }}
                >
                    <span className="text-white text-xs font-bold">{currentTick.ask.toFixed(5)}</span>
                </div>

                {/* Bid Badge (Blue) */}
                <div
                    className="absolute right-0 px-2 py-0.5 z-20 transition-all duration-300 ease-out flex items-center"
                    style={{ top: `${currentBidY}%`, transform: 'translateY(-50%)', backgroundColor: '#0a84ff' }}
                >
                    <span className="text-white text-xs font-bold">{currentTick.bid.toFixed(5)}</span>
                </div>

                {/* Y-Axis Static Labels (Approximate logic) */}
                <div className="absolute right-0 top-[20%] -translate-y-1/2 text-[10px] text-gray-500 pr-16 opacity-50">{(yMax - (yMax - yMin) * 0.2).toFixed(5)}</div>
                <div className="absolute right-0 top-[60%] -translate-y-1/2 text-[10px] text-gray-500 pr-16 opacity-50">{(yMax - (yMax - yMin) * 0.6).toFixed(5)}</div>

            </div>

            {/* Disclaimer Text */}
            <div className="bg-black px-4 pt-4 pb-2 text-center">
                <p className="text-[#666] text-[11px] leading-tight">
                    Attention! The trade will be executed at market conditions, difference with requested price may be significant!
                </p>
            </div>

            {/* Bottom Button - NO BACKGROUND, ORANGE TEXT */}
            <button
                onClick={() => setStep('processing')}
                className="w-full pb-8 pt-2 bg-black flex items-center justify-center space-x-2"
            >
                <span className="text-[#ff9800] text-[15px] font-bold uppercase whitespace-nowrap">
                    CLOSE WITH {trade.profit >= 0 ? 'PROFIT' : 'LOSS'}
                </span>
                <span className={`text-base font-bold ${trade.profit < 0 ? 'text-[#ff3b30]' : 'text-[#0a84ff]'}`}>
                    {trade.profit.toFixed(2)}
                </span>
            </button>
        </div>
    );
};

export default ClosePositionScreen;
