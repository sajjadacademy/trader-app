import React from 'react';
import { ArrowUpDown, BarChart2, TrendingUp, History, MessageSquare } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'quotes', label: 'Quotes', icon: ArrowUpDown },
        { id: 'charts', label: 'Charts', icon: BarChart2 }, // Approximating candlesticks
        { id: 'trade', label: 'Trade', icon: TrendingUp },
        { id: 'history', label: 'History', icon: History },
        { id: 'messages', label: 'Messages', icon: MessageSquare }, // Or MessagesSquare if available
    ];

    return (
        <div className="h-[60px] bg-black border-t border-[#1c1c1e] flex justify-around items-center px-2 select-none pb-1">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <div
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex flex-col items-center justify-center w-full cursor-pointer transition-all duration-200 group`}
                    >
                        {/* Pill Container */}
                        <div className={`flex flex-col items-center justify-center px-5 py-1 rounded-full transition-colors duration-200 ${isActive ? 'bg-[#d1e3fa]' : 'bg-transparent'}`}>
                            {/* Icon: Active=Blue, Inactive=Gray */}
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={isActive ? "text-[#007aff]" : "text-[#8e8e93] group-hover:text-white"}
                            />
                        </div>
                        {/* Label: Active=Blue, Inactive=White/Gray */}
                        <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-[#007aff]' : 'text-white'}`}>{tab.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default BottomNav;
