import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Bot, Maximize2, Minimize2 } from 'lucide-react';
import { generateAssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: "Hi Alex! I'm your Academic Co-Pilot. I can help with your schedule, grades, or finding campus resources.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateAssistantResponse(input);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-[60] bg-white dark:bg-neutral-900 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out border border-gray-200 dark:border-neutral-800
        ${isExpanded 
            ? 'inset-4 md:inset-20 rounded-2xl' 
            : 'bottom-6 right-6 w-full max-w-[400px] h-[600px] rounded-2xl'
        }
    `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-neutral-700 dark:to-neutral-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-neutral-100">Co-Pilot</h3>
                    <p className="text-xs text-green-500 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors hidden md:block">
                    {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button onClick={onClose} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 rounded-full text-gray-400 transition-colors">
                    <X size={20} />
                </button>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-neutral-950 transition-colors">
            <div className="space-y-6">
                <div className="flex justify-center mb-6">
                     <span className="text-xs font-medium text-gray-400 dark:text-neutral-500 bg-gray-200/50 dark:bg-neutral-900/50 px-3 py-1 rounded-full">Today, {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>

                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'model' && (
                             <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                <Bot size={14} className="text-blue-600 dark:text-neutral-300" />
                             </div>
                        )}
                        <div 
                            className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-blue-600 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-br-none shadow-blue-200 dark:shadow-none' 
                                : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 rounded-bl-none border border-gray-100 dark:border-neutral-800'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                         <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                            <Bot size={14} className="text-blue-600 dark:text-neutral-300" />
                         </div>
                        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl rounded-bl-none border border-gray-100 dark:border-neutral-800 shadow-sm flex gap-1 items-center">
                            <span className="w-2 h-2 bg-blue-400 dark:bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-blue-400 dark:bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-blue-400 dark:bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 transition-colors">
            <div className="flex gap-2 items-center bg-gray-50 dark:bg-neutral-800 p-2 rounded-xl border border-gray-200 dark:border-neutral-700 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-neutral-700 focus-within:border-blue-200 dark:focus-within:border-neutral-600 transition-all">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 dark:text-neutral-200 placeholder-gray-400 px-2"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="w-9 h-9 bg-blue-600 dark:bg-neutral-100 rounded-lg flex items-center justify-center text-white dark:text-neutral-900 hover:bg-blue-700 dark:hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    </div>
  );
};

export default AiAssistant;