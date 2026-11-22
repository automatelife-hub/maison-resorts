'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Compass, Sparkles, Receipt, HelpCircle, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HotelCardData {
  id: string;
  name: string;
  city: string;
  photo: string;
  minPrice: number;
  star_rating: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hotels?: HotelCardData[];
}

export function ConciergeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Greetings from Maison. I am your editorial travel concierge, here to guide you to conscious luxury sanctuaries, verify flight connections, check booking ledgers, or unlock member circle points.\n\nWould you like me to curate some sanctuary recommendations, or assist in searching for a specific destination?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        hotels: data.hotels
      }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but my connection to the Maison registry has been momentarily interrupted. Please try again shortly.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage(input);
    }
  };

  // Helper to parse markdown links: [text](url) -> <a> tag
  const formatMessageText = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      parts.push(
        <Link 
          key={match.index} 
          href={url} 
          className="text-accent underline hover:text-white transition-colors duration-200"
        >
          {label}
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Split paragraphs and render linebreaks
    const rawText = parts.length > 0 ? parts : [text];
    return rawText.map((part, i) => {
      if (typeof part === 'string') {
        return part.split('\n').map((line, j) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < part.split('\n').length - 1 && <br />}
          </span>
        ));
      }
      return <span key={i}>{part}</span>;
    });
  };

  const suggestionPills = [
    { label: 'Curate Sanctuaries', text: 'Recommend some slow-mode sanctuaries', icon: Sparkles },
    { label: 'Search London', text: 'Find quiet hotels in London', icon: Compass },
    { label: 'Promo Vouchers', text: 'What vouchers are active?', icon: Receipt },
    { label: 'Booking Status', text: 'Check my booking status', icon: HelpCircle }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-[360px] md:w-[400px] h-[580px] bg-luxury/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col mb-4"
          >
            {/* Header */}
            <div className="bg-luxury border-b border-white/5 p-4 flex justify-between items-center">
              <div>
                <h3 className="text-xs tracking-[0.2em] font-bold uppercase text-white font-serif italic">
                  MAISON <span className="text-accent">Concierge</span>
                </h3>
                <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-0.5">Heritage Travel Curator</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scroll Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/5"
            >
              {messages.map((m, idx) => (
                <div key={idx} className="space-y-3">
                  <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-accent text-luxury rounded-br-none font-medium'
                          : 'bg-white/5 border border-white/5 text-gray-200 rounded-bl-none font-serif italic'
                      }`}
                    >
                      {formatMessageText(m.content)}
                    </div>
                  </div>

                  {/* Render Hotels if present */}
                  {m.hotels && m.hotels.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {m.hotels.map((hotel) => (
                        <div 
                          key={hotel.id}
                          className="flex gap-3 bg-white/5 border border-white/5 rounded-xl p-2.5 hover:border-accent/40 transition-all duration-300 group"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative">
                            <img 
                              src={hotel.photo} 
                              alt={hotel.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute top-1 left-1 bg-luxury/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] flex items-center gap-0.5 text-accent">
                              <Star size={6} fill="currentColor" />
                              <span>{hotel.star_rating}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h4 className="text-[11px] font-bold text-white tracking-wide truncate group-hover:text-accent transition-colors">
                                {hotel.name}
                              </h4>
                              <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-0.5">{hotel.city}</p>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-[10px] text-gray-300">
                                from <span className="font-serif italic font-bold text-accent">${hotel.minPrice}</span> / night
                              </p>
                              <Link 
                                href={`/hotel?id=${hotel.id}`}
                                className="text-[8px] uppercase tracking-widest text-accent hover:text-white flex items-center gap-1 transition-colors"
                              >
                                View <ArrowRight size={8} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 rounded-xl rounded-bl-none px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="p-3 border-t border-white/5 bg-white/[0.01] grid grid-cols-2 gap-2">
                {suggestionPills.map((pill, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(pill.text)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-accent/30 text-left transition-all duration-300 group"
                  >
                    <pill.icon size={12} className="text-accent group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] uppercase tracking-wider text-gray-300 font-medium truncate">
                      {pill.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <div className="p-3 border-t border-white/5 bg-luxury">
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-1 focus-within:border-accent/40 transition-colors">
                <input
                  type="text"
                  placeholder="Enquire about sanctuaries..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-xs py-2 text-white placeholder-gray-500 focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-accent hover:text-white disabled:opacity-30 transition-all"
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-accent text-luxury rounded-full flex items-center justify-center shadow-2xl relative border border-white/10 group cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare size={20} />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white border-2 border-accent rounded-full animate-pulse" />
      </motion.button>
    </div>
  );
}
