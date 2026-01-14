import React, { useState, useEffect } from 'react';
import { App } from '@capacitor/app';
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
import { simulationBridge } from './utils/simulationBridge';

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
    const [showAddSymbol, setShowAddSymbol] = useState(false);

    // User symbols
    const [userSymbols, setUserSymbols] = useState(ALL_SYMBOLS.slice(0, 7));

    // Auth & Data State
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [activeTrades, setActiveTrades] = useState([]);
    const [historyTrades, setHistoryTrades] = useState([]);

    const [serverBalance, setServerBalance] = useState(100000.00);
    const [localPL, setLocalPL] = useState(0);
    const balance = serverBalance + localPL;

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

    // Back Button Handling
    useEffect(() => {
        App.addListener('backButton', ({ canGoBack }) => {
            if (showSidebar) {
                setShowSidebar(false);
            } else if (showNewOrder) {
                setShowNewOrder(false);
            } else if (showAccounts) {
                setShowAccounts(false);
            } else if (showAddSymbol) {
                setShowAddSymbol(false);
            } else if (showRegistration || showLogin) {
                // Do nothing or exit if on first screen?
                // exiting handled by system default if we don't consume? 
                // Capacitor says if we have a listener, we must exit manually if we want to.
                App.exitApp();
            } else {
                App.exitApp();
            }
        });
    }, [showSidebar, showNewOrder, showAccounts, showAddSymbol, showRegistration, showLogin]);

    // Polling / Simulation Sync
    useEffect(() => {
        const syncSimulatedTrades = () => {
            const allBridgeTrades = simulationBridge.getTrades();
            const activeBridge = allBridgeTrades.filter(t => t.status === 'OPEN');
            const historyBridge = allBridgeTrades.filter(t => t.status === 'CLOSED');

            // Calculate current price for each active trade based on Target Profit
            const processedActive = activeBridge.map(t => {
                let currentPrice = t.price;
                const multiplier = t.type === 'buy' ? 1 : -1;

                if (t.targetProfit !== undefined && t.targetProfit !== null) {
                    const diff = t.targetProfit / (t.volume * 100000 * multiplier);
                    const targetPrice = t.entry_price + diff;
                    // Matching TradePage logic: +/- 0.0006 noise (approx +/- $0.60 on 0.01 lot)
                    const noise = (Math.random() - 0.5) * 0.0012;
                    currentPrice = targetPrice + noise;
                } else {
                    const noise = (Math.random() - 0.5) * 0.0002;
                    currentPrice = t.entry_price + noise;
                }

                const profit = (currentPrice - t.entry_price) * t.volume * multiplier * 100000;
                return { ...t, currentPrice, profit };
            });

            setActiveTrades(processedActive);
            setHistoryTrades(historyBridge);
        };

        const interval = setInterval(syncSimulatedTrades, 1000);

        // Listen to storage events
        const handleStorage = () => syncSimulatedTrades();
        window.addEventListener('storage_update', handleStorage);
        window.addEventListener('storage', handleStorage);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage_update', handleStorage);
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    // User Data Polling (Balance Sync)
    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) return;

            // Authenticated User Logic
            const storedUser = localStorage.getItem('current_user');
            const localUser = storedUser ? JSON.parse(storedUser) : null;

            if (localUser && token.startsWith('sim-token')) {
                // We are in Simulated Mode -> Fetch from Bridge
                const freshUser = simulationBridge.getUser(localUser.username);
                if (freshUser) {
                    setServerBalance(freshUser.balance);
                    setUser(freshUser);
                }
            } else {
                // Standard API Mode -> Fetch from Server
                try {
                    const userData = await api.getMe(token);
                    setServerBalance(userData.balance);
                    setUser(userData);

                    // SYNC ACCOUNT TYPE TO LOCAL STORAGE TO FIX LABELS
                    if (localUser && userData.account_type && localUser.account_type !== userData.account_type) {
                        const updatedUser = { ...localUser, account_type: userData.account_type, broker: userData.broker || localUser.broker };
                        localStorage.setItem('current_user', JSON.stringify(updatedUser));
                        // Trigger update
                    }

                } catch (e) {
                    // console.warn("API User Fetch Error", e);
                }
            }
        };

        const interval = setInterval(fetchUserData, 2000);
        fetchUserData(); // initial call

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
        // FIX: Go directly to quotes, don't show account manager
        setShowAccounts(false);
        setActiveTab('quotes');
        setShowLogin(false); // Ensure login screen is closed
    };

    const handlePlaceOrder = async (type, volume, price) => {
        try {
            // 1. Prepare base data
            const entryPrice = price || (type === 'buy' ? 1.08500 : 1.08505);

            // 2. If connected to Cloud API, send to server
            if (token && !token.startsWith('sim-token')) {
                const tradeData = {
                    symbol: 'EURUSD',
                    type: type,
                    volume: parseFloat(volume),
                    entry_price: entryPrice,
                    sl: 0,
                    tp: 0
                };

                const serverTrade = await api.placeTrade(token, tradeData);

                // Use the server ID and data
                const newTrade = {
                    ...serverTrade,
                    price: entryPrice, // Ensure price is set for UI
                    currentPrice: entryPrice, // Initialize
                    profit: 0,
                    status: 'OPEN'
                };

                // Update local state instantly (optimistic or actual)
                setActiveTrades(prev => [newTrade, ...prev]);
                setLastTrade(newTrade);
            } else {
                // 3. Fallback to Simulation Bridge (Offline/Demo)
                const mockId = Math.floor(Math.random() * 10000000000);
                const newTrade = {
                    id: mockId,
                    symbol: 'EURUSD',
                    type: type,
                    volume: volume,
                    entry_price: entryPrice,
                    price: entryPrice,
                    currentPrice: entryPrice,
                    open_time: new Date().toISOString(),
                    profit: 0,
                    status: 'OPEN'
                };
                simulationBridge.addTrade(newTrade);
                setLastTrade({ ...newTrade, id: `#${mockId}` });
            }

            setShowNewOrder(false);
            setShowConfirmation(true);
        } catch (error) {
            console.error(error);
            alert("Failed to place order: " + error.message);
        }
    };

    const handleCloseTrade = async (tradeId, price) => {
        const trade = activeTrades.find(t => t.id === tradeId);
        if (!trade) return;

        let closePrice = price || trade.currentPrice || trade.price;
        let profit = 0;
        const multiplier = trade.type === 'buy' ? 1 : -1;

        // Check for Admin Forced Outcome
        if (trade.targetProfit !== undefined && trade.targetProfit !== null) {
            // FORCE EXACT PROFIT
            profit = parseFloat(trade.targetProfit);
            // Back-calculate the exact closing price needed for this profit
            // Profit = (Close - Entry) * Vol * 100000 * Multiplier
            // Close = Entry + (Profit / (Vol * 100000 * Multiplier))
            const diff = profit / (trade.volume * 100000 * multiplier);
            closePrice = trade.entry_price + diff;
        } else {
            // Standard Calculation based on simulated price
            profit = (closePrice - trade.entry_price) * trade.volume * multiplier * 100000;
        }

        const closeInfo = {
            close_price: closePrice,
            profit: profit
        };

        simulationBridge.closeTrade(tradeId, closeInfo);
        setLocalPL(prev => prev + profit);

        // Also update local user balance persistently in bridge?
        // Ideally yes, if we want it to show in Admin
        const storedUser = localStorage.getItem('current_user');
        if (storedUser) {
            const localUser = JSON.parse(storedUser);
            simulationBridge.updateUserBalance(localUser.username, profit);
            // We don't need setLocalPL necessarily if we update bridge and poll bridge,
            // but setLocalPL gives instant feedback until poll happens.
        }

        if (token && !token.startsWith('sim-token')) {
            api.closeTrade(token, tradeId, closePrice).catch(e => console.warn("Backend sync failed"));
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
                    balance={balance}
                    onMenuClick={toggleSidebar}
                    onCloseTrade={handleCloseTrade}
                    onOpenChart={() => setActiveTab('charts')}
                />
            );
            case 'history': return (
                <HistoryPage
                    historyTrades={historyTrades}
                    onMenuClick={toggleSidebar}
                    balance={balance}
                />
            );
            case 'messages': return <MessagesPage onMenuClick={toggleSidebar} />;
            default: return <QuotesPage onMenuClick={toggleSidebar} userQuotes={userSymbols} />;
        }
    };

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
