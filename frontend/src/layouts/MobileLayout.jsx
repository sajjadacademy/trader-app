import React from 'react';
import BottomNav from '../components/BottomNav';

const MobileLayout = ({ children, activeTab, onTabChange }) => {
    return (
        <div className="flex flex-col h-screen bg-mt5-bg text-mt5-text max-w-md mx-auto border-x border-gray-800 shadow-2xl relative">
            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {children}
            </div>

            {/* Bottom Navigation */}
            <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        </div>
    );
};

export default MobileLayout;
