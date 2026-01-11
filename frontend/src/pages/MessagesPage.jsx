import React, { useState } from 'react';
import { Menu, Search, MessageCircle } from 'lucide-react';

const MessagesPage = ({ onMenuClick }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMessage]);
        setInputValue('');
    };

    return (
        <div className="flex flex-col h-full bg-black text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black border-b border-[#2c2c2e]">
                <div className="flex items-center space-x-4">
                    <button onClick={onMenuClick}><Menu size={24} className="text-white" /></button>
                    <h1 className="text-xl font-bold">Messages</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="border border-white rounded px-1 text-[10px] font-bold">MQID</div>
                    <Search size={24} className="text-white" />
                </div>
            </div>

            {/* Messages List or Empty State */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 -mt-20">
                        <div className="bg-[#1c1c1e] rounded-full p-6">
                            <MessageCircle size={48} className="text-gray-500" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">No messages</p>
                        <p className="text-gray-600 text-xs text-center max-w-[200px]">Send a message to start a conversation with support.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'me' ? 'bg-[#0a84ff] text-white' : 'bg-[#2c2c2e] text-white'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                            <span className="text-[10px] text-gray-500 mt-1">{msg.time}</span>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#1c1c1e] pb-6"> {/* pb-6 for mobile safe area */}
                <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter message..."
                        className="flex-1 bg-[#2c2c2e] text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0a84ff]"
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className={`p-2.5 rounded-full transition ${inputValue.trim() ? 'bg-[#0a84ff] text-white' : 'bg-[#2c2c2e] text-gray-500'}`}
                        disabled={!inputValue.trim()}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
