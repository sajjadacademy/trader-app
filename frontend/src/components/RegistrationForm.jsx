import React, { useState } from 'react';
import { ArrowLeft, Monitor } from 'lucide-react';
import { api } from '../api';

const RegistrationForm = ({ onClose, onLoginSuccess }) => {
    const [step, setStep] = useState('input'); // input, success
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        broker: 'MetaQuotes-Demo',
        account_type: 'demo',
        balance: '100000'
    });

    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            await api.register({
                username: formData.username,
                password: formData.password,
                full_name: formData.full_name,
                broker: formData.broker,
                account_type: formData.account_type,
                balance: parseFloat(formData.balance)
            });

            setStep('success');
        } catch (error) {
            alert('Registration Failed: ' + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handleDone = async () => {
        setLoading(true);
        try {
            const data = await api.login(formData.username, formData.password);
            onLoginSuccess(data.access_token);
            onClose();
        } catch (error) {
            alert('Auto-login failed. Please try again.');
            onClose(); // Close anyway so they can try manual login
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-black text-white flex flex-col animate-in slide-in-from-right duration-300 font-sans">

            {/* Header */}
            <div className="flex items-center space-x-4 p-4 border-b border-[#2c2c2e]">
                {step === 'input' && (
                    <button onClick={onClose}><ArrowLeft size={24} className="text-white" /></button>
                )}
                <div>
                    <h1 className="text-lg font-bold">Open a new account</h1>
                    {step === 'input' && <p className="text-xs text-gray-400">Enter account details</p>}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">

                {/* Logo Section */}
                <div className="flex items-center space-x-4 p-6 justify-center">
                    <div className="w-16 h-16 relative">
                        <img src="/mt5-real-logo.png" alt="MT5 Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">MT5 Account</h3>
                        <p className="text-sm text-gray-400">MT5 Trading</p>
                    </div>
                </div>

                {/* INPUT STATE */}
                {step === 'input' && (
                    <>
                        <div className="bg-[#1c1c1e] py-1 px-4 mt-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase">Account Details</h4>
                        </div>

                        <div className="px-4">
                            <div className="flex justify-between items-center py-3 border-b border-[#2c2c2e]">
                                <span className="text-gray-300">Username</span>
                                <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="bg-transparent text-right text-white placeholder-gray-500 outline-none w-1/2" placeholder="User123" />
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-[#2c2c2e]">
                                <span className="text-gray-300">Password</span>
                                <input type="text" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="bg-transparent text-right text-white placeholder-gray-500 outline-none w-1/2" placeholder="Secret123" />
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-[#2c2c2e]">
                                <span className="text-gray-300">Full Name</span>
                                <input type="text" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="bg-transparent text-right text-white placeholder-gray-500 outline-none w-1/2" placeholder="John Doe" />
                            </div>
                        </div>

                        <div className="bg-[#1c1c1e] py-1 px-4 mt-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase">Trading Specs</h4>
                        </div>

                        <div className="px-4">
                            <div className="flex justify-between items-center py-3 border-b border-[#2c2c2e]">
                                <span className="text-gray-300">Account type</span>
                                <select
                                    value={formData.account_type}
                                    onChange={e => setFormData({ ...formData, account_type: e.target.value })}
                                    className="bg-transparent text-right text-white outline-none w-1/2"
                                >
                                    <option value="demo" className="text-black">Demo</option>
                                    <option value="real" className="text-black">Real</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-[#2c2c2e]">
                                <span className="text-gray-300">Deposit</span>
                                <input type="number" value={formData.balance} onChange={e => setFormData({ ...formData, balance: e.target.value })} className="bg-transparent text-right text-white placeholder-gray-500 outline-none w-1/2" />
                            </div>
                        </div>
                    </>
                )}

                {/* SUCCESS STATE */}
                {step === 'success' && (
                    <>
                        <div className="px-4">
                            <div className="flex justify-between items-center py-3 border-b border-[#2c2c2e]">
                                <span className="text-[#8e8e93]">Name</span>
                                <span className="text-white text-right">{formData.full_name}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-[#2c2c2e]">
                                <span className="text-[#8e8e93]">Account type</span>
                                <span className="text-white text-right">{formData.account_type}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-[#2c2c2e]">
                                <span className="text-[#8e8e93]">Deposit</span>
                                <span className="text-white text-right">{formData.balance}</span>
                            </div>
                        </div>

                        <div className="bg-[#2c2c2e] text-center py-3 mt-4 mb-4">
                            <span className="text-xs font-bold text-[#8e8e93] tracking-wide">ACCOUNT SUCCESSFULLY CREATED</span>
                        </div>

                        <div className="px-4">
                            <div className="flex justify-between items-center py-3 border-b border-[#2c2c2e]">
                                <span className="text-[#8e8e93]">Login</span>
                                <span className="text-white text-right font-mono text-lg">{formData.username}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-[#2c2c2e]">
                                <span className="text-[#8e8e93]">Password</span>
                                <span className="text-white text-right font-mono text-lg">{formData.password}</span>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 mt-4">
                            <Monitor className="text-white" size={32} />
                            <p className="text-[#8e8e93] text-[10px] leading-tight max-w-[200px]">
                                READY TO TRADE
                            </p>
                        </div>
                    </>
                )}

                <div className="p-4 mt-6 mb-8">
                    <button
                        onClick={step === 'input' ? handleRegister : handleDone}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-full shadow-lg active:scale-95 transition disabled:opacity-50"
                    >
                        {loading ? 'PROCESSING...' : (step === 'input' ? 'REGISTER' : 'DONE')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
