import React from 'react';
import { Menu, Shield, Quote, Plus, MoreVertical, QrCode, Bell } from 'lucide-react';

const AccountsPage = ({ onBack, onMenuClick, user, onAddAccount, onRegister, onSignIn }) => {
    // Robust fallback
    const userInfo = user || {
        username: 'Guest',
        full_name: 'User',
        id: '00000000',
        account_type: 'demo',
        balance: 0.00,
        account_login: '...'
    };

    const safeBalance = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? "0.00" : num.toLocaleString('en-US', { minimumFractionDigits: 2 });
    };

    // Edit Profile State
    const [showEditProfile, setShowEditProfile] = React.useState(false);
    const [editName, setEditName] = React.useState(userInfo.full_name || '');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Call API
            const importedApi = (await import('../api')).api;
            await importedApi.updateProfile(token, { full_name: editName });

            // Update local storage to reflect immediately? 
            // Better to rely on MobileApp polling, but let's update local check
            const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
            localStorage.setItem('current_user', JSON.stringify({ ...currentUser, full_name: editName }));

            setShowEditProfile(false);
            window.location.reload(); // Simple reload to refresh all states
        } catch (error) {
            alert("Failed to update profile: " + error.message);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black text-white relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-mt5-black-header">
                <div className="flex items-center space-x-4">
                    <button onClick={onMenuClick}><Menu size={24} className="text-white" /></button>
                    <h1 className="text-xl font-bold text-white">Accounts</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <Shield size={22} className="text-white" />
                    <div className="relative">
                        <Quote size={22} className="text-white rotate-180" />
                        <div className="absolute -top-1 -right-1 bg-white text-black text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center">?</div>
                    </div>
                    <button onClick={onAddAccount}>
                        <Plus size={24} className="text-white" />
                    </button>
                    <MoreVertical size={24} className="text-white" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
                {/* Account Card */}
                <div className="bg-[#1c1c1e] rounded-[24px] p-6 relative overflow-hidden shadow-lg mb-6">
                    {/* Green Ribbon - Only for Demo */}
                    {userInfo.account_type !== 'real' && (
                        <div className="absolute top-0 right-0">
                            <div className="bg-[#34c759] text-white text-xs font-bold py-1 px-8 rotate-45 translate-x-8 translate-y-4 shadow-sm">
                                Demo
                            </div>
                        </div>
                    )}

                    {/* Logo */}
                    <div className="flex justify-center mb-2">
                        <div className="w-16 h-16 relative">
                            <img src="/mt5-real-logo.png" alt="MT5 Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="text-center space-y-1 mb-4">
                        <h2 className="text-lg font-bold flex items-center justify-center gap-2">
                            {userInfo.full_name || 'User'}
                            <button onClick={() => setShowEditProfile(true)} className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">Edit</button>
                        </h2>
                        <p className="text-mt5-blue text-sm font-medium">
                            {userInfo.account_type === 'real' ? 'Exness (SC) Ltd' : 'MetaQuotes-Demo'}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="text-center space-y-1 mb-6">
                        <p className="text-[#8e8e93] text-xs">{(userInfo.account_login || '...') + ' - ' + (userInfo.account_type === 'real' ? 'Exness-MT5Real' : 'MetaQuotes-Demo')}</p>
                        <p className="text-[#8e8e93] text-xs">Access point</p>
                    </div>

                    {/* Balance */}
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold">{safeBalance(userInfo.balance)} USD</h1>
                    </div>

                    {/* Footer Icons */}
                    <div className="flex justify-between items-center px-2 mt-4">
                        <QrCode size={20} className="text-[#8e8e93]" />
                        <Bell size={20} className="text-[#8e8e93]" />
                    </div>
                </div>

                {/* Auth Options (Requested) */}
                <div className="flex space-x-4 px-2">
                    <button
                        onClick={onSignIn}
                        className="flex-1 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-mt5-blue py-3 rounded-xl font-bold text-sm"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={onRegister}
                        className="flex-1 bg-mt5-blue hover:bg-blue-600 text-white py-3 rounded-xl font-bold text-sm"
                    >
                        Register
                    </button>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditProfile && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1c1c1e] w-full max-w-sm rounded-[24px] p-6 shadow-xl border border-gray-800">
                        <h2 className="text-lg font-bold mb-4 text-center">Edit Profile</h2>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="mb-4">
                                <label className="text-xs text-gray-400 block mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowEditProfile(false)} className="flex-1 py-3 rounded-lg bg-gray-800 font-bold text-sm">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-lg bg-blue-600 font-bold text-sm">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountsPage;
