import React from 'react';
import { Menu, FileText, Check, Files } from 'lucide-react';

const OrderConfirmation = ({ trade, onDone }) => {
    return (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col font-sans">
            {/* Header matching screenshot standards */}
            <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center">
                    <Menu className="text-[#e1e1e1] mr-6" size={24} />
                    <h1 className="text-[19px] font-normal text-[#e1e1e1] tracking-normal">New Order</h1>
                </div>
                {/* Copy/Files Icon matching header color */}
                <Files className="text-[#e1e1e1]" size={24} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center pb-32">
                {/* Custom Icon: Green Circle -> Black File -> Green Check */}
                <div className="w-28 h-28 rounded-full bg-[#87c58e] flex items-center justify-center mb-6">
                    {/* Black File Shape */}
                    <div className="w-12 h-16 bg-black rounded-sm flex items-center justify-center relative">
                        {/* Folded corner detail */}
                        <div className="absolute top-0 right-0 w-4 h-4 bg-[#87c58e]"></div>
                        {/* The Flap itself */}
                        <div className="absolute top-0 right-0 w-4 h-4 bg-black/40 rounded-bl-sm"></div>

                        {/* Green Checkmark inside the file */}
                        <Check size={28} className="text-[#87c58e] mt-2 ml-0.5" strokeWidth={4} />
                    </div>
                </div>

                <h2 className="text-[26px] text-white font-bold mb-4">Done</h2>

                <div className="flex flex-col items-center text-sm space-y-1">
                    {/* Line 1: SIDE VOLUME / VOLUME */}
                    <div className="flex items-center gap-1.5 text-base">
                        {/* 
                           Note: In New Order, if we BUY, we are OPENING a BUY.
                           In Close Position, CLOSING a BUY was a SELL.
                           Here, we just show what we did. 
                           If trade.type is 'buy', we show 'BUY' in BLUE.
                           If trade.type is 'sell', we show 'SELL' in RED.
                        */}
                        <span className={trade.type === 'buy' ? 'text-[#0a84ff] font-bold' : 'text-[#ff3b30] font-bold'}>
                            {trade.type === 'buy' ? 'BUY' : 'SELL'}
                        </span>
                        <span className="text-white font-bold text-sm tracking-wide">
                            {trade.volume.toFixed(2)} / {trade.volume.toFixed(2)}
                        </span>
                    </div>

                    {/* Line 2: Symbol at Price */}
                    <div className="text-[#8e8e93] text-[15px] font-medium">
                        {trade.symbol} at {trade.price.toFixed(5)}
                    </div>

                    {/* Line 3: ID */}
                    <div className="text-[#8e8e93] text-[15px] font-medium">#{trade.id || '8102837834'}</div>
                </div>
            </div>

            {/* Bottom Footer Button - Fixed at bottom */}
            <div className="absolute bottom-0 w-full bg-[#2c2c2e]">
                <button
                    onClick={onDone}
                    className="w-full py-4 text-white text-sm font-bold uppercase tracking-wider bg-transparent active:bg-[#3a3a3c] transition-colors"
                >
                    DONE
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;
