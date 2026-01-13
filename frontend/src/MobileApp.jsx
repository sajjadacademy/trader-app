import React, { useState, useEffect } from 'react';
import MobileLayout from './layouts/MobileLayout';
import QuotesPage from './pages/QuotesPage';
import AccountsPage from './pages/AccountsPage';
import TradePage from './pages/TradePage';
import HistoryPage from './pages/HistoryPage';
import MessagesPage from './pages/MessagesPage';
import DemoAccountModal from './components/DemoAccountModal';
import RegistrationForm from './components/RegistrationForm';
import LoginPage from './pages/LoginPage';
import ChartsPage from './pages/ChartsPage';
import Sidebar from './components/Sidebar';
import AddSymbolPage from './pages/AddSymbolPage';
import NewOrderPage from './pages/NewOrderPage';
import OrderConfirmation from './components/OrderConfirmation';
import { ALL_SYMBOLS } from './data/symbols';
import { api } from './api';

const MobileApp = () => {
    // UI State
    const [activeTab, setActiveTab] = useState('quotes');
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showAccounts, setShowAccounts] = useState(false);
    const [showNewOrder, setShowNewOrder] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [lastTrade, setLastTrade] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    // New UI State for Add Symbol
    const [showAddSymbol, setShowAddSymbol] = useState(false);

    // User symbols
    const [userSymbols, setUserSymbols] = useState(ALL_SYMBOLS.slice(0, 7));

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
                // Augment trades with simulation data
                const active = allTrades.filter(t => t.status === 'OPEN').map(t => {
                    const currentPrice = t.type === 'buy' ? 1.08510 : 1.08490; // Mock current price fallback
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

    const handlePlaceOrder = async (type, volume, price) => {
        if (!token) return;

        try {
            // Mock trade ID since API might not return it instantly in this demo text
            const mockId = Math.floor(Math.random() * 10000000000);

            await api.placeTrade(token, {
                symbol: 'EURUSD',
                type: type,
                volume: volume,
                entry_price: price || (type === 'buy' ? 1.08500 : 1.08505),
                sl: 0,
                tp: 0
            });

            setLastTrade({
                symbol: 'EURUSD',
                type,
                volume,
                price: price || (type === 'buy' ? 1.08500 : 1.08505),
                id: `#${mockId}`
            });

            setShowNewOrder(false);
            setShowConfirmation(true);
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
        } catch (error) {
            alert("Failed to close trade: " + error.message);
        }
    };

    const handleAddSymbol = (symbolObj) => {
        setUserSymbols(prev => {
            if (prev.find(s => s.symbol === symbolObj.symbol)) return prev;
            return [...prev, symbolObj];
        });
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
            case 'quotes': return (
                <QuotesPage
                    onMenuClick={toggleSidebar}
                    userQuotes={userSymbols}
                    onAddSymbolClick={() => setShowAddSymbol(true)}
                />
            );
            case 'charts': return <ChartsPage onMenuClick={toggleSidebar} />;
            case 'trade': return (
                <TradePage
                    onNewOrder={() => setShowNewOrder(true)}
                    activeTrades={activeTrades}
                    balance={balance} // Pass balance for generic stats
                    onMenuClick={toggleSidebar}
                    onCloseTrade={handleCloseTrade}
                />
            );
            case 'history': return <HistoryPage historyTrades={historyTrades} onMenuClick={toggleSidebar} />;
            case 'messages': return <MessagesPage onMenuClick={toggleSidebar} />;
            default: return <QuotesPage onMenuClick={toggleSidebar} userQuotes={userSymbols} />;
        }
    };

    // Authentication Guard
    if (!token) {
        if (showRegistration) {
            return <RegistrationForm onClose={() => setShowRegistration(false)} onLoginSuccess={handleLoginSuccess} />;
        }
        return (
            <LoginPage
                onClose={() => { }}
                onLoginSuccess={handleLoginSuccess}
                onRegister={() => setShowRegistration(true)}
                isRoot={true}
            />
        );
    }

    // Full screen overlays that hide bottom menu
    if (showNewOrder) {
        return (
            <NewOrderPage
                symbol="EURUSD"
                onClose={() => setShowNewOrder(false)}
                onPlaceOrder={handlePlaceOrder}
            />
        );
    }

    if (showConfirmation && lastTrade) {
        return (
            <OrderConfirmation
                trade={lastTrade}
                onDone={() => {
                    setShowConfirmation(false);
                    setActiveTab('trade');
                }}
            />
        );
    }

    if (showAddSymbol) {
        return (
            <AddSymbolPage
                onBack={() => setShowAddSymbol(false)}
                onAddSymbol={handleAddSymbol}
                userSymbols={userSymbols}
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
        </MobileLayout>
    );
};

export default MobileApp;
