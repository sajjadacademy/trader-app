import React, { useState } from 'react';
import { X } from 'lucide-react';

const NewOrderModal = ({ isOpen, onClose, onPlaceOrder }) => {
    if (!isOpen) return null;

    const [volume, setVolume] = useState(1.00);

    return (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end animate-in slide-in-from-bottom duration-200">
            <div className="bg-[#1c1c1e] w-full rounded-t-2xl p-6 pb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white font-bold text-lg">New Order</h2>
                    <button onClick={onClose}><X className="text-gray-400" /></button>
                </div>

                <div className="flex justify-center items-center space-x-4 mb-8">
                    <button onClick={() => setVolume(Math.max(0.01, volume - 0.1))} className="text-blue-500 font-bold p-2">-0.1</button>
                    <button onClick={() => setVolume(Math.max(0.01, volume - 0.01))} className="text-blue-500 font-bold p-2">-0.01</button>
                    <span className="text-white font-bold text-2xl font-mono w-20 text-center">{volume.toFixed(2)}</span>
                    <button onClick={() => setVolume(volume + 0.01)} className="text-blue-500 font-bold p-2">+0.01</button>
                    <button onClick={() => setVolume(volume + 0.1)} className="text-blue-500 font-bold p-2">+0.1</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onPlaceOrder('sell', volume)}
                        className="bg-red-500/10 border border-red-500 text-red-500 py-3 rounded-lg font-bold hover:bg-red-500 hover:text-white transition"
                    >
                        SELL by Market
                    </button>
                    <button
                        onClick={() => onPlaceOrder('buy', volume)}
                        className="bg-blue-500/10 border border-blue-500 text-blue-500 py-3 rounded-lg font-bold hover:bg-blue-500 hover:text-white transition"
                    >
                        BUY by Market
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewOrderModal;
