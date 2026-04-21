'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Mic, 
  Sparkles, 
  X, 
  ArrowRight, 
  Command, 
  Zap,
  Globe,
  Wind,
  Moon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ConciergeSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thoughtTrace, setThoughtTrace] = useState<string[]>([]);
  const router = useRouter();

  // Shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !down);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsThinking(true);
    setThoughtTrace([]);
    
    const traces = [
      "Analyzing atmospheric preferences...",
      "Locating niche heritage sanctuaries...",
      "Evaluating conscious sentiment...",
      "Mapping the 2026 collection..."
    ];

    for (const trace of traces) {
      setThoughtTrace(prev => [...prev, trace]);
      await new Promise(r => setTimeout(r, 800));
    }

    router.push(`/results?destination=${encodeURIComponent(query)}&vibe=semantic`);
    setTimeout(() => {
      setIsThinking(false);
      setIsOpen(false);
      setQuery('');
    }, 500);
  };

  const handleSuggestionClick = (label: string) => {
    setQuery(label);
    // Auto-trigger search for suggestions
    router.push(`/results?destination=${encodeURIComponent(label)}&vibe=semantic`);
    setIsOpen(false);
  };

  const suggestions = [
    { label: "Quiet Italian Retreat", icon: <Moon size={12} /> },
    { label: "Arctic Design Frontier", icon: <Wind size={12} /> },
    { label: "Mediterranean Heritage", icon: <Globe size={12} /> },
    { label: "High-Alps Recovery", icon: <Sparkles size={12} /> }
  ];

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[55]">
        <motion.button 
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)' }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-full bg-accent text-luxury flex items-center justify-center shadow-2xl relative group"
        >
          <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20 group-hover:opacity-40" />
          <Zap size={24} fill="currentColor" className="relative z-10" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#051612]/98 backdrop-blur-3xl p-6"
          >
            <div className="w-full max-w-3xl">
              <div className="flex justify-between items-center mb-12">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                       <Zap size={16} fill="currentColor" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">Maison Intelligence</span>
                 </div>
                 <button 
                   onClick={() => setIsOpen(false)}
                   className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                 >
                   <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleSearch} className="relative mb-12">
                <div className="relative group">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-accent">
                    {isThinking ? (
                      <div className="w-6 h-6 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                    ) : (
                      <Search size={24} strokeWidth={3} />
                    )}
                  </div>
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe your perfect escape..."
                    className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-10 pl-24 pr-44 text-2xl text-white placeholder:text-gray-700 outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all font-serif italic"
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-6">
                     <button type="button" className="p-3 rounded-full hover:bg-white/5 text-gray-500 hover:text-accent transition-colors">
                        <Mic size={22} />
                     </button>
                     <button 
                       type="submit"
                       className="p-5 bg-accent text-luxury rounded-[1.5rem] shadow-2xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
                     >
                        <ArrowRight size={28} strokeWidth={3} />
                     </button>
                  </div>
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <section>
                    <h4 className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-6 font-bold">Suggested Intentions</h4>
                    <div className="grid grid-cols-1 gap-2">
                       {suggestions.map((s) => (
                         <button 
                           key={s.label}
                           onClick={() => handleSuggestionClick(s.label)}
                           className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/[0.08] transition-all text-left group"
                         >
                            <span className="text-gray-500 group-hover:text-accent transition-colors">{s.icon}</span>
                            <span className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-white transition-all font-bold">
                               {s.label}
                            </span>
                         </button>
                       ))}
                    </div>
                 </section>

                 <section>
                    <h4 className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mb-6 font-bold">Conscious Reasoning</h4>
                    <div className="space-y-4">
                       {thoughtTrace.length > 0 ? (
                         thoughtTrace.map((trace, i) => (
                           <motion.div 
                             key={i}
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             className="flex items-center gap-4"
                           >
                              <div className="w-1 h-1 rounded-full bg-accent" />
                              <span className="text-[10px] text-gray-400 italic">{trace}</span>
                           </motion.div>
                         ))
                       ) : (
                         <p className="text-[10px] text-gray-700 italic">Maison Intelligence is standing by.</p>
                       )}
                    </div>
                 </section>
              </div>

              <div className="mt-24 pt-8 border-t border-white/5 text-center">
                 <p className="text-[8px] uppercase tracking-[0.5em] text-gray-800">
                    &copy; 2026 Maison AI Concierge. Precision of Escape.
                 </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
