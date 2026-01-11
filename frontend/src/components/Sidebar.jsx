import React from 'react';
import {
    X, TrendingUp, Newspaper, Mail, BookOpen, Settings,
    Calendar, Users, Send, HelpCircle, Info, Pencil, User
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, user, onManageAccounts }) => {
    if (!isOpen) return null;

    // Use passed user or mock fallback
    const userInfo = user || {
        username: 'Guest',
        full_name: 'Guest User',
        id: '10009060423',
        account_login: '...',
        account_type: 'demo', // 'demo' or 'real'
        balance: 100000.00
    };

    // ... inside render ...
    <a href="#" onClick={(e) => { e.preventDefault(); onClose(); onManageAccounts && onManageAccounts(); }} className="text-[#0a84ff] text-[13px] font-medium hover:underline">Manage accounts</a>

    const MenuItem = ({ icon: Icon, label, badge }) => (
        <div className="flex items-center p-4 hover:bg-[#1c1c1e] cursor-pointer">
            <Icon size={24} className="text-gray-400 mr-4" />
            <span className="text-white font-bold text-sm flex-1">{label}</span>
            {badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge === 'Ads' ? 'bg-[#2c2c2e] text-blue-400 border border-blue-500' : 'bg-red-500 text-white rounded-full min-w-[18px] text-center'}`}>
                    {badge}
                </span>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="relative w-[85%] max-w-[320px] bg-black h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                {/* Header */}
                <div className="p-6 pt-10 border-b border-[#1c1c1e] relative overflow-hidden">
                    {/* Ribbon - Dynamic Color/Text (Demo Only) */}
                    {userInfo.account_type !== 'real' && (
                        <div className="absolute top-0 right-0 py-1 px-8 translate-x-8 translate-y-3 rotate-45 text-[10px] font-bold text-white shadow-sm z-10 bg-[#34c759]">
                            Demo
                        </div>
                    )}

                    <div className="flex items-start mb-2">
                        {/* Avatar / Logo - Exact MT5 Logo */}
                        <div className="w-16 h-16 mr-4 flex-shrink-0">
                            {/* Uses the file we copied to public/mt5-logo.png */}
                            <img src="/mt5-real-logo.png" alt="MetaTrader 5" className="w-full h-full object-contain" />
                        </div>

                        {/* User Info Block */}
                        <div className="flex flex-col pt-1">
                            <h2 className="text-white font-bold text-lg leading-tight mb-0.5">{userInfo.full_name}</h2>
                            <p className="text-[#8e8e93] text-[12px] font-medium leading-tight mb-2">
                                {/* ID - Broker - Server Type */}
                                {userInfo.account_login || '...'} - {userInfo.account_type === 'real' ? 'Exness-MT5Real' : 'MetaQuotes-Demo'}
                            </p>
                            <a href="#" onClick={(e) => { e.preventDefault(); onClose(); onManageAccounts && onManageAccounts(); }} className="text-[#0a84ff] text-[13px] font-medium hover:underline">Manage accounts</a>
                            <p className="text-[#8e8e93] text-[10px] mt-1">
                                {userInfo.account_type === 'real' ? 'Exness (SC) Ltd' : 'MetaQuotes-Demo'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-2">
                    <MenuItem icon={TrendingUp} label="Trade" />
                    <MenuItem icon={Newspaper} label="News" />
                    <MenuItem icon={Mail} label="Mailbox" badge="8" />
                    <MenuItem icon={BookOpen} label="Journal" />
                    <MenuItem icon={Settings} label="Settings" />
                    <div className="h-[1px] bg-[#1c1c1e] mx-4 my-1"></div>
                    <MenuItem icon={Calendar} label="Economic calendar" badge="Ads" />
                    <MenuItem icon={Users} label="Traders Community" />
                    <MenuItem icon={Send} label="MQL5 Algo Trading" />
                    <div className="h-[1px] bg-[#1c1c1e] mx-4 my-1"></div>
                    <MenuItem icon={HelpCircle} label="User guide" />
                    <MenuItem icon={Info} label="About" />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
