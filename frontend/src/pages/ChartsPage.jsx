import React, { useState } from 'react';
import { Menu, Crosshair, Clock, Activity } from 'lucide-react';
import ChartWidget from '../components/ChartWidget';

const ChartsPage = ({ onMenuClick }) => {
    const [timeframe, setTimeframe] = useState('M5');
    const [showTimeframes, setShowTimeframes] = useState(false);

    // Custom Icon Components for near-pixel-perfect match
    const ClockIcon = () => (
        <div className="relative w-6 h-6 flex items-center justify-center">
            {/* Red Left Half */}
            <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#ff3b30] rounded-l-full opacity-80"></div>
            {/* Blue Right Half */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#007aff] rounded-r-full opacity-80"></div>
            {/* Clock Face Overlay */}
            <Clock size={16} strokeWidth={2.5} className="text-white z-10 relative" />
        </div>
    );

    const OneClickIcon = () => (
        <div className="w-7 h-5 relative flex items-center justify-center border border-gray-500 rounded bg-[#2c2c2e]">
            {/* Red Box */}
            <div className="absolute left-[2px] w-[10px] h-[12px] bg-[#ff3b30] rounded-[1px]"></div>
            {/* Blue Box */}
            <div className="absolute right-[2px] w-[10px] h-[12px] bg-[#007aff] rounded-[1px] translate-y-[-2px] z-10 shadow-sm border border-black"></div>
        </div>
    );

    // Exact match for "Indicators" (Sine Wave on Diagonal)
    // Screenshot shows a diagonal line / with a sine wave oscillating across it.
    const IndicatorsIconFinal = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Diagonal Line */}
            <path d="M6 19L18 5" strokeOpacity="0.5" />
            {/* Sine Wave */}
            <path d="M7 15C7 15 9 20 12 12C15 4 17 9 17 9" />
        </svg>
    );

    // Exact match for "Crosshair" (Simple Reticle - No Circle)
    // Screenshot shows four segments aiming at a center, or a simple cross with a gap/dot.
    const CrosshairIconFinal = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            {/* Top */}
            <path d="M12 4V9" />
            {/* Bottom */}
            <path d="M12 15V20" />
            {/* Left */}
            <path d="M4 12H9" />
            {/* Right */}
            <path d="M15 12H20" />
            {/* Center Dot */}
            <circle cx="12" cy="12" r="1.5" fill="white" stroke="none" />
        </svg>
    );


    const intervals = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1'];

    return (
        <div className="flex flex-col h-full bg-black text-white relative">
            {/* Header - Now Relative and Opaque */}
            <div className="relative z-20 flex items-center justify-between px-4 h-14 bg-black border-b border-[#1c1c1e]">
                <div>
                    <button onClick={onMenuClick}>
                        <Menu size={28} className="text-white" />
                    </button>
                </div>

                <div className="flex items-center space-x-6">
                    {/* Indicators Icon */}
                    <IndicatorsIconFinal />

                    {/* Crosshair */}
                    <CrosshairIconFinal />

                    {/* Timeframe Selector Trigger */}
                    <button
                        onClick={() => setShowTimeframes(!showTimeframes)}
                        className="text-white font-bold text-md hover:text-mt5-blue transition-colors"
                    >
                        {timeframe}
                    </button>

                    {/* Clock (Red/Blue Circle) */}
                    <ClockIcon />

                    {/* One Click Trading Toggle */}
                    <OneClickIcon />
                </div>
            </div>

            {/* Timeframe Dropdown (Simple for now, to ensure clarity) */}
            {showTimeframes && (
                <div className="absolute top-14 right-16 z-30 bg-[#1c1c1e] border border-gray-700 rounded-lg shadow-xl p-2 grid grid-cols-4 gap-2">
                    {intervals.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => { setTimeframe(tf); setShowTimeframes(false); }}
                            className={`px-3 py-2 text-sm font-bold rounded ${timeframe === tf ? 'bg-mt5-blue text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            )}

            {/* Chart Area - Now sits below header */}
            <div className="flex-1 relative bg-black overflow-hidden border-t border-gray-800">
                {/* Symbol Overlay is inside widget generally or we can keep the static one if widget allows symbol change we'd need to match. 
                    However, keeping the static overlay on top gives that 'app' feel of persistence.
                    We will remove the static overlay if it clashes, but for now let's keep it minimal or remove it since user didn't explicitly complain about it, 
                    but the widget usually has its own legend. The screenshot shows a custom overlay "EURUSD M5...".
                    Let's keep the custom overlay but update its M5 text dynamically.
                 */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-sm font-bold text-shadow-sm text-blue-400">EURUSD</h1>
                        <span className="text-xs font-bold text-white">{timeframe}</span>
                    </div>
                    <p className="text-[10px] text-gray-300">Euro vs US Dollar</p>
                </div>

                {/* Chart Widget */}
                <ChartWidget interval={timeframe} />
            </div>
        </div>
    );
};

export default ChartsPage;
