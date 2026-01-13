import React, { useState } from 'react';
import { ArrowLeft, Search, Folder, Plus, Check } from 'lucide-react';
import { ALL_SYMBOLS } from '../data/symbols';

const AddSymbolPage = ({ onBack, onAddSymbol, userSymbols }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null); // 'Forex', 'Crypto', etc.

    // Group symbols by folder
    const groups = ['Forex', 'Metals', 'Indices', 'Crypto', 'Exotics'];

    // Filter logic
    const filteredSymbols = ALL_SYMBOLS.filter(s => {
        // If searching, ignore groups and search everything
        if (searchTerm) {
            return s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.description.toLowerCase().includes(searchTerm.toLowerCase());
        }
        // If group selected, show only that group
        if (selectedGroup) {
            return s.group === selectedGroup;
        }
        // Otherwise don't show symbols, show groups main menu
        return false;
    });

    const isAdded = (symbol) => userSymbols.some(us => us.symbol === symbol);

    return (
        <div className="flex flex-col h-full bg-black text-white">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-[#1c1c1e] space-x-4">
                <button onClick={() => selectedGroup ? setSelectedGroup(null) : onBack()}>
                    <ArrowLeft size={24} className="text-white" />
                </button>
                <h1 className="text-xl font-bold">Add symbol</h1>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-[#1c1c1e]">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Find symbols"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1c1c1e] text-white pl-10 pr-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Breadcrumb / Navigation */}
            <div className="flex items-center px-4 py-2 bg-[#1c1c1e] text-sm text-blue-400 font-medium">
                <button onClick={() => setSelectedGroup(null)} disabled={!selectedGroup}>Home</button>
                {selectedGroup && (
                    <>
                        <span className="mx-2 text-gray-500">▶</span>
                        <span className="text-gray-400">{selectedGroup}</span>
                    </>
                )}
                {searchTerm && (
                    <>
                        <span className="mx-2 text-gray-500">▶</span>
                        <span className="text-gray-400">Search Results</span>
                    </>
                )}
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto">
                {/* 1. Folder List (if no search & no group selected) */}
                {!searchTerm && !selectedGroup && (
                    <div className="divide-y divide-[#1c1c1e]">
                        {groups.map(group => (
                            <button
                                key={group}
                                onClick={() => setSelectedGroup(group)}
                                className="w-full flex items-center px-4 py-4 hover:bg-[#1c1c1e] transition-colors"
                            >
                                <Folder className="text-yellow-600 mr-4" size={24} fill="currentColor" fillOpacity={0.2} />
                                <span className="text-lg font-bold">{group}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* 2. Symbol List (if searched or group selected) */}
                {(searchTerm || selectedGroup) && (
                    <div className="divide-y divide-[#1c1c1e]">
                        {filteredSymbols.map(symbol => (
                            <div key={symbol.symbol} className="flex justify-between items-center px-4 py-3">
                                <div>
                                    <div className="text-base font-bold text-white">{symbol.symbol}</div>
                                    <div className="text-xs text-gray-400">{symbol.description}</div>
                                </div>
                                <button
                                    onClick={() => onAddSymbol(symbol)}
                                    className="p-2"
                                    disabled={isAdded(symbol.symbol)}
                                >
                                    {isAdded(symbol.symbol) ? (
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                            <Check size={16} className="text-white" />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border border-blue-500 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors">
                                            <Plus size={16} />
                                        </div>
                                    )}
                                </button>
                            </div>
                        ))}
                        {filteredSymbols.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No symbols found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddSymbolPage;
