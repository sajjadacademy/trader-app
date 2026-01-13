import React, { useState, useEffect } from 'react';
import MobileLayout from './layouts/MobileLayout';
import QuotesPage from './pages/QuotesPage';
import AccountsPage from './pages/AccountsPage';
import TradePage from './pages/TradePage';
import HistoryPage from './pages/HistoryPage';
import MessagesPage from './pages/MessagesPage';
import DemoAccountModal from './components/DemoAccountModal';
import RegistrationForm from './components/RegistrationForm';
import LoginPage from './pages/LoginPage'; // Use new Full Page Login
import ChartsPage from './pages/ChartsPage';
import NewOrderModal from './components/NewOrderModal';
import Sidebar from './components/Sidebar';
import { api } from './api';

const MobileApp = () => {
    // UI State
    const [activeTab, setActiveTab] = useState('quotes');
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [showLogin, setShowLogin] = useState(false); // Login State
    const [showAccounts, setShowAccounts] = useState(false);
    const [showNewOrder, setShowNewOrder] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    // Auth & Data State
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [activeTrades, setActiveTrades] = useState([]);
    const [historyTrades, setHistoryTrades] = useState([]);
    const [balance, setBalance] = useState(100000.00);

    // Initial Load - Check for registration
    useEffect(() => {
        const timer = setTimeout(() => {
            const hasAccount = localStorage.getItem('hasAccount');
            if (!showAccounts && !token && !localStorage.getItem('token') && !hasAccount) {
                setShowDemoModal(true);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [token]);

    // Polling System
    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const allTrades = await api.getTrades(token);
                const active = allTrades.filter(t => t.status === 'OPEN').map(t => {
                    const currentPrice = t.type === 'buy' ? 1.08510 : 1.08490; // Mock current price
                    const multiplier = t.type === 'buy' ? 1 : -1;
                    const profit = (currentPrice - t.entry_price) * t.volume * multiplier * 100000;

                    return {
                        ...t,
                        currentPrice,
                        profit: t.forced_outcome === 'WIN' ? 50 : (t.forced_outcome === 'LOSS' ? -50 : profit)
                    };
                });
                const history = allTrades.filter(t => t.status === 'CLOSED');

                setActiveTrades(active);
                setHistoryTrades(history);

                const userData = await api.getMe(token);
                setBalance(userData.balance);
                setUser(userData);

            } catch (error) {
                console.error("Polling error", error);
                if (error.message.includes("401")) {
                    setToken(null);
                    localStorage.removeItem('token');
                }
            }
        };

        const interval = setInterval(fetchData, 2000);
        fetchData();

        return () => clearInterval(interval);
    }, [token]);


    const handleOpenAccount = () => {
        setShowDemoModal(false);
        setShowRegistration(true);
    };

    const handleLoginSuccess = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
        localStorage.setItem('hasAccount', 'true');
        setShowRegistration(false);
        setShowAccounts(true);
    };

    const handlePlaceOrder = async (type, volume) => {
        if (!token) return; // Should not happen now

        try {
            await api.placeTrade(token, {
                symbol: 'EURUSD',
                type: type,
                volume: volume,
                entry_price: type === 'buy' ? 1.08500 : 1.08505,
                sl: 0,
                tp: 0
            });
            setShowNewOrder(false);
        } catch (error) {
            alert("Failed to place order: " + error.message);
        }
    };

    const handleCloseTrade = async (tradeId, price) => {
        if (!token) return;
        try {
            await api.closeTrade(token, tradeId, price);
            // Optimistic update
            setActiveTrades(prev => prev.filter(t => t.id !== tradeId));
            alert("Trade Closed");
        } catch (error) {
            alert("Failed to close trade: " + error.message);
        }
    };

    const toggleSidebar = () => setShowSidebar(true);

    const renderContent = () => {
        if (showAccounts) {
            return (
                <AccountsPage
                    onBack={() => setShowAccounts(false)}
                    onMenuClick={toggleSidebar}
                    user={user}
                    onAddAccount={() => setShowLogin(true)}
                    onSignIn={() => setShowLogin(true)}
                    onRegister={() => setShowRegistration(true)}
                />
            );
        }

        switch (activeTab) {
            case 'quotes': return <QuotesPage onMenuClick={toggleSidebar} />;
            case 'charts': return <ChartsPage onMenuClick={toggleSidebar} />;
            case 'trade': return (
                <TradePage
                    onMenuClick={toggleSidebar}
                    onNewOrder={() => setShowNewOrder(true)}
                    activeTrades={activeTrades}
                    balance={balance}
                    onCloseTrade={handleCloseTrade}
                />
            );
            case 'history': return <HistoryPage onMenuClick={toggleSidebar} historyTrades={historyTrades} balance={balance} />;
            case 'messages': return (
                <MessagesPage
                    onMenuClick={toggleSidebar}
                    onRegister={() => setShowRegistration(true)}
                    onSignIn={() => setShowLogin(true)}
                />
            );
            default: return <QuotesPage onMenuClick={toggleSidebar} />;
        }
    };

    // Authentication Guard
    if (!token) {
        if (showRegistration) {
            return <RegistrationForm onClose={() => setShowRegistration(false)} onLoginSuccess={handleLoginSuccess} />;
        }
        return (
            <LoginPage
                onClose={() => { }} // Cannot close login if not auth
                onLoginSuccess={handleLoginSuccess}
                onRegister={() => setShowRegistration(true)}
                isRoot={true}
            />
        );
    }

    return (
        <MobileLayout activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setShowAccounts(false); }}>
            {renderContent()}

            <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} user={user} onManageAccounts={() => setShowAccounts(true)} />

            {showRegistration && (
                <RegistrationForm
                    onClose={() => setShowRegistration(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

            {showLogin && (
                <LoginPage
                    onClose={() => setShowLogin(false)}
                    onLoginSuccess={handleLoginSuccess}
                    onRegister={() => { setShowLogin(false); setShowRegistration(true); }}
                    isRoot={false}
                />
            )}

            {showNewOrder && (
                <NewOrderModal
                    isOpen={showNewOrder}
                    onClose={() => setShowNewOrder(false)}
                    onPlaceOrder={handlePlaceOrder}
                />
            )}
        </MobileLayout>
    );
};

export default MobileApp;
