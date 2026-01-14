import React, { useState } from 'react';
import { ArrowLeft, GraduationCap, TrendingUp, ChevronDown, Check } from 'lucide-react';
import { api } from '../api';
import { simulationBridge } from '../utils/simulationBridge';

const LoginPage = ({ onClose, onLoginSuccess, onRegister, isRoot = false }) => {
    // view: 'landing' | 'login'
    const [view, setView] = useState('landing');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [savePassword, setSavePassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const cleanUsername = username.trim();
        const cleanPassword = password.trim();

        // 1. Try API First (Priority: Server)
        try {
            console.log("Attempting API login...");
            const data = await api.login(cleanUsername, cleanPassword);
            console.log("API login success");
            onLoginSuccess(data.access_token);
            setLoading(false);
            return; // API Success - Stop here
        } catch (apiError) {
            console.error("API login failed:", apiError);

            // If it's a credential error from server, DON'T try local (unless we want to support offline mode for same creds?)
            // But if it's a NETWORK error, we should try local.
            // For simplicity/robustness: If API fails, try Local as fallback for "Offline Demo" users.

            const isNetworkError = apiError.message.includes("Failed to fetch") || apiError.message.includes("NetworkError");

            if (!isNetworkError && apiError.message !== "Login failed") {
                // If server explicitly rejected creds, we might still check local *just in case* it's a pure local demo account.
                // But usually server rejection is final for real accounts.
            }
        }

        // 2. Fallback to Simulation Bridge (Local DB)
        try {
            console.log("Attempting local login fallback for:", cleanUsername);
            const localUser = simulationBridge.login(cleanUsername, cleanPassword);

            // Local login success
            localStorage.setItem('current_user', JSON.stringify(localUser));

            setTimeout(() => {
                onLoginSuccess(`sim-token-${localUser.username}`);
                setLoading(false);
            }, 500);
            return;

        } catch (localError) {
            console.log("Local login failed:", localError.message);
        }

        // 3. Both Failed
        setLoading(false);
        alert("Login Failed: Invalid credentials or connection issue.");
        setError("Invalid credentials or connection issue.");
    };

    const handleBack = () => {
        if (view === 'login') {
            setView('landing');
        } else {
            // In landing view
            if (!isRoot) {
                onClose();
            }
        }
    };

    const isBackVisible = view === 'login' || !isRoot;

    return (
        <div className="fixed inset-0 bg-black text-white min-h-screen z-50 overflow-y-auto animate-in fade-in slide-in-from-bottom-5 duration-300 font-sans">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-800">
                <button
                    onClick={handleBack}
                    className={`mr-4 text-white hover:bg-gray-800 rounded-full p-1 ${!isBackVisible ? 'invisible' : ''}`}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-medium tracking-wide">MT5 Account</h1>
            </div>

            <div className="p-5 space-y-8">

                {/* VIEW: LANDING */}
                {view === 'landing' && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="space-y-4">
                            <button
                                onClick={onRegister}
                                className="w-full flex items-center justify-between bg-transparent hover:bg-gray-900 transition p-2 rounded-lg group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 group-hover:bg-gray-700">
                                        <GraduationCap size={24} strokeWidth={1.5} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base text-gray-200">Open a demo account</h3>
                                        <p className="text-xs text-gray-500">To learn trading and to test your strategies</p>
                                    </div>
                                </div>
                                <div className="text-gray-600">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </div>
                            </button>

                            <button
                                onClick={onRegister}
                                className="w-full flex items-center justify-between bg-transparent hover:bg-gray-900 transition p-2 rounded-lg group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white group-hover:bg-blue-500 shadow-lg shadow-blue-900/20">
                                        <TrendingUp size={24} strokeWidth={1.5} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base text-white font-medium">Open a real account</h3>
                                        <p className="text-xs text-gray-400">For live trading, additional identification is required</p>
                                    </div>
                                </div>
                                <div className="text-gray-600">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </div>
                            </button>
                        </div>

                        <div className="pt-8 text-center">
                            <h2 className="text-sm font-bold text-gray-300 mb-6">Existing User?</h2>
                            <button
                                onClick={() => setView('login')}
                                className="w-full bg-[#1c1c1e] text-blue-500 font-bold py-4 rounded-full text-sm uppercase tracking-wide hover:bg-[#2c2c2e] transition"
                            >
                                LOGIN TO EXISTING ACCOUNT
                            </button>
                        </div>
                    </div>
                )}

                {/* VIEW: LOGIN FORM */}
                {view === 'login' && (
                    <div className="animate-in slide-in-from-right duration-300">
                        <h2 className="text-sm font-bold text-gray-300 mb-6">Login to an existing account</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Login Field */}
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="login"
                                    className="peer w-full bg-transparent border-b border-gray-600 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-transparent"
                                    placeholder="Login"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <label
                                    htmlFor="login"
                                    className="absolute left-0 -top-2.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-500"
                                >
                                    Login
                                </label>
                            </div>

                            {/* Password Field */}
                            <div className="relative group">
                                <input
                                    type="password"
                                    id="password"
                                    className="peer w-full bg-transparent border-b border-gray-600 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-transparent"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-0 -top-2.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-500"
                                >
                                    Password
                                </label>
                            </div>

                            {/* Server Dropdown (Visual) */}
                            <div className="relative group">
                                <div className="w-full bg-transparent border-b border-gray-600 py-2 flex justify-between items-center text-white cursor-pointer hover:border-gray-500">
                                    <span className="text-white">MT5-Real</span>
                                    <ChevronDown size={16} className="text-gray-500" />
                                </div>
                                <label className="absolute left-0 -top-2.5 text-xs text-gray-500">
                                    Server
                                </label>
                            </div>

                            {/* Save Password & Forgot */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSavePassword(!savePassword)}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${savePassword ? 'bg-blue-600 border-blue-600' : 'border-gray-500 bg-transparent'}`}>
                                        {savePassword && <Check size={14} className="text-white" />}
                                    </div>
                                    <span className="text-sm text-gray-400">Save password</span>
                                </div>
                            </div>

                            <div className="text-center pt-2">
                                <button type="button" className="text-blue-500 text-sm hover:text-blue-400">
                                    Forgot password?
                                </button>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-900/30 border border-red-800 rounded text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-full text-sm uppercase tracking-wide hover:bg-blue-500 active:scale-[0.98] transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                            >
                                {loading ? 'Logging in...' : 'LOGIN'}
                            </button>

                            <div className="text-center mt-6">
                                <button type="button" onClick={onRegister} className="text-sm text-gray-400 hover:text-white transition">
                                    Don't have an account? <span className="text-blue-500">Create one</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            {/* Server Dropdown */}
            {/* ... (existing code) ... */}

            <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-gray-600">
                Server: {import.meta.env.VITE_API_URL ? 'Cloud' : 'Local'} ({import.meta.env.VITE_API_URL || 'localhost'})
            </div>
        </div>
    );
};

export default LoginPage;
