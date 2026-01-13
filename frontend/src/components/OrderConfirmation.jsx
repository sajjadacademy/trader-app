import React from 'react';
import { Menu, FileText, Check } from 'lucide-react';

const OrderConfirmation = ({ trade, onDone }) => {
    return (
        <div className="flex flex-col h-full bg-black text-white font-sans overflow-hidden">
            {/* Header: Menu (Left), 'New Order' (Left-Center), File Icon (Right) */}
            <div className="flex items-center justify-between px-4 py-3 bg-black">
                <div className="flex items-center space-x-5">
                    <button className="text-white">
                        <Menu size={26} strokeWidth={2} />
                    </button>
                    <h1 className="text-xl font-bold text-white tracking-wide">New Order</h1>
                </div>

                <button className="text-[#8e8e93]">
                    <FileText size={26} strokeWidth={1.5} />
                </button>
            </div>

            {/* Main Content: Positioned towards top, not centered */}
            <div className="flex-1 flex flex-col items-center pt-16">
                {/* Green Circle with File/Check Icon */}
                <div className="w-24 h-24 rounded-full bg-[#81c784] flex items-center justify-center mb-4 shadow-lg shadow-green-900/10">
                    {/* Inner Icon: Document with Checkmark. 
                        Simulating the specific 'File Check' look with lucide or just a Check if simple.
                        The screenshot shows a generic 'document with check' filled black. 
                    */}
                    <div className="relative">
                        <FileText size={40} className="text-black fill-current" strokeWidth={2} />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#81c784]">
                            <Check size={20} strokeWidth={4} />
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white tracking-wide mb-2">Done</h2>

                <div className="text-center space-y-1">
                    {/* BUY 0.01 / 0.01 */}
                    <div className="text-base font-bold tracking-tight">
                        <span className={`${trade.type === 'buy' ? 'text-[#0a84ff]' : 'text-[#ff3b30]'} uppercase mr-1.5`}>
                            {trade.type}
                        </span>
                        <span className="text-[#8e8e93] font-normal">
                            {trade.volume.toFixed(2)} / {trade.volume.toFixed(2)}
                        </span>
                    </div>

                    {/* EURUSD at 1.16431 */}
                    <div className="text-[#8e8e93] text-sm">
                        {trade.symbol} at {trade.price.toFixed(5)}
                    </div>

                    {/* Ticket ID */}
                    <div className="text-[#5c5c5e] text-sm font-medium">
                        #{trade.id || '54661839181'}
                    </div>
                </div>
            </div>

            {/* Bottom Footer Button */}
            <div className="w-full">
                <button
                    onClick={onDone}
                    className="w-full py-4 text-center bg-[#2c2c2e] text-white font-bold text-sm uppercase tracking-wider active:bg-[#3a3a3c] transition-colors"
                >
                    DONE
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;
