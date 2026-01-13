import React from 'react';
import { Menu, FileText } from 'lucide-react';

const OrderConfirmation = ({ trade, onDone }) => {
    return (
        <div className="flex flex-col h-full bg-black text-white font-sans overflow-hidden">
            {/* Header: Menu Icon (left), Title 'New Order', File Icon (right) */}
            <div className="flex items-center justify-between px-4 py-3 bg-black border-b border-[#3a3a3c]">
                <div className="flex items-center space-x-6">
                    {/* Menu Icon */}
                    <button className="text-white">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-white tracking-wide">New Order</h1>
                </div>
                {/* File/Log Icon */}
                <button className="text-gray-300">
                    <FileText size={24} strokeWidth={1.5} />
                </button>
            </div>

            {/* Main Content: Centered vertically */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                {/* Green Circle with Document Check Icon */}
                <div className="w-24 h-24 rounded-full bg-[#81c784] flex items-center justify-center mb-6 shadow-lg shadow-green-900/20">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-black ml-1 mt-1 transform scale-110">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="9 15 11 17 15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-white tracking-wide mb-3">Done</h2>

                <div className="text-center space-y-1">
                    {/* TYPE 0.01 / 0.01 */}
                    <div className="text-xl font-bold tracking-tight">
                        <span className={`${trade.type === 'buy' ? 'text-[#0a84ff]' : 'text-[#ff3b30]'} uppercase mr-2`}>
                            {trade.type}
                        </span>
                        <span className="text-white/90">
                            {trade.volume.toFixed(2)} / {trade.volume.toFixed(2)}
                        </span>
                    </div>

                    {/* EURUSD at 1.12345 */}
                    <div className="text-[#8e8e93] text-sm font-medium">
                        {trade.symbol} at {trade.price.toFixed(5)}
                    </div>

                    {/* Ticket ID */}
                    <div className="text-[#5c5c5e] text-sm">
                        #{trade.id || Math.floor(Math.random() * 10000000000)}
                    </div>
                </div>
            </div>

            {/* Bottom Footer Bar */}
            <div className="bg-[#1c1c1e] w-full">
                <button
                    onClick={onDone}
                    className="w-full py-4 text-center text-white font-bold text-sm uppercase tracking-wider active:bg-[#2c2c2e] transition"
                >
                    DONE
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;
