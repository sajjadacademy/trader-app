import React from 'react';
import { ArrowUpDown, CandlestickChart, TrendingUp, History, MessagesSquare } from 'lucide-react';

// Custom SVG for Charts (Two Sharp Candlesticks)
const CustomChartsIcon = ({ size, className, strokeWidth }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* Left Candle (Lower) - Sharp corners */}
        <path d="M8 11v4" /> {/* Center line check - wait, wicks are usually center. 
            Rect x=6, width=4 -> center is 8. 
        */}
        <path d="M8 8v3" />   {/* Top Wick */}
        <path d="M8 17v3" />  {/* Bottom Wick */}
        <rect x="6" y="11" width="4" height="6" rx="0.5" />

        {/* Right Candle (Higher) */}
        <path d="M16 3v3" />   {/* Top Wick */}
        <path d="M16 12v3" />  {/* Bottom Wick */}
        <rect x="14" y="6" width="4" height="6" rx="0.5" />
    </svg>
);

// Custom SVG for Trade (Zigzag Line with White Endpoints)
const CustomTradeIcon = ({ size, className, strokeWidth, isActive }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        {/* Zigzag Line */}
        <polyline
            points="3 17 9 11 13 15 21 6"
            stroke={isActive ? "#0a84ff" : "currentColor"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* Small White Circles at First and Last Point (with stroke to see them if bg is white) */}
        <circle cx="3" cy="17" r="2" fill="white" stroke={isActive ? "#0a84ff" : "currentColor"} strokeWidth="1.5" />
        <circle cx="21" cy="6" r="2" fill="white" stroke={isActive ? "#0a84ff" : "currentColor"} strokeWidth="1.5" />
    </svg>
);

const BottomNav = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'quotes', label: 'Quotes', icon: ArrowUpDown },
        { id: 'charts', label: 'Charts', icon: CustomChartsIcon },
        { id: 'trade', label: 'Trade', icon: CustomTradeIcon },
        { id: 'history', label: 'History', icon: History },
        { id: 'messages', label: 'Messages', icon: MessagesSquare },
    ];

    return (
        <div className="h-[80px] bg-black flex justify-between items-center px-1 select-none pb-2">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <div
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group`}
                    >
                        {/* Pill Container: White background for active state - Reduced padding to prevent cutoff */}
                        <div
                            className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-full transition-colors duration-200`}
                            style={{ backgroundColor: isActive ? '#FFFFFF' : 'transparent' }}
                        >
                            {/* Icon: Active=Blue(Light), Inactive=Gray */}
                            <Icon
                                size={26} // Slightly smaller icon to help fit
                                strokeWidth={isActive ? 2.5 : 2}
                                isActive={isActive}
                                className={isActive ? "text-[#0a84ff]" : "text-[#8e8e93] group-hover:text-gray-400"}
                            />
                        </div>
                        {/* Label: Active=Blue, Inactive=Gray */}
                        <span className={`text-[10px] font-bold mt-1.5 ${isActive ? 'text-[#0a84ff]' : 'text-[#8e8e93]'}`}>{tab.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default BottomNav;
