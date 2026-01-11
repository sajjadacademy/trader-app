import React from 'react';
import { X } from 'lucide-react';

const DemoAccountModal = ({ isOpen, onClose, onOpenAccount }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
            <div className="bg-[#1c1c1e] w-full max-w-sm rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-[#2c2c2e]">
                    <h2 className="text-white font-bold text-lg">Open a demo account</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 text-center space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-white text-lg font-medium">MetaQuotes Ltd.</h3>
                        <a href="#" className="text-blue-400 text-sm">www.metaquotes.net</a>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed px-2">
                        By opening an account, you agree to the account opening terms and to the data protection policy of MetaQuotes Ltd.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full bg-mt5-blue hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition active:scale-95"
                    >
                        Open an Account
                    </button>

                    <p className="text-gray-500 text-[11px] leading-tight px-2">
                        To trade using real money, you need to apply for a real trading account by entering into a separate agreement with a financial services company.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DemoAccountModal;
