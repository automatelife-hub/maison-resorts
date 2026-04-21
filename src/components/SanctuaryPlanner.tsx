'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Minus, X, ChevronDown, User, Baby } from 'lucide-react';

interface Room {
  adults: number;
  childrenAges: number[];
}

interface SanctuaryPlannerProps {
  occupancies: Room[];
  onChange: (occupancies: Room[]) => void;
}

export function SanctuaryPlanner({ occupancies, onChange }: SanctuaryPlannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalVoyagers = occupancies.reduce((acc, curr) => acc + curr.adults + curr.childrenAges.length, 0);
  const totalRooms = occupancies.length;

  const updateRoom = (index: number, updates: Partial<Room>) => {
    const newOccupancies = [...occupancies];
    newOccupancies[index] = { ...newOccupancies[index], ...updates };
    onChange(newOccupancies);
  };

  const addRoom = () => {
    if (occupancies.length < 4) {
      onChange([...occupancies, { adults: 1, childrenAges: [] }]);
    }
  };

  const removeRoom = (index: number) => {
    if (occupancies.length > 1) {
      const newOccupancies = occupancies.filter((_, i) => i !== index);
      onChange(newOccupancies);
    }
  };

  const addChild = (roomIndex: number) => {
    if (occupancies[roomIndex].childrenAges.length < 3) {
      const newAges = [...occupancies[roomIndex].childrenAges, 0];
      updateRoom(roomIndex, { childrenAges: newAges });
    }
  };

  const removeChild = (roomIndex: number, childIndex: number) => {
    const newAges = occupancies[roomIndex].childrenAges.filter((_, i) => i !== childIndex);
    updateRoom(roomIndex, { childrenAges: newAges });
  };

  const updateChildAge = (roomIndex: number, childIndex: number, age: number) => {
    const newAges = [...occupancies[roomIndex].childrenAges];
    newAges[childIndex] = age;
    updateRoom(roomIndex, { childrenAges: newAges });
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-white text-sm font-medium group"
      >
        <div className="flex flex-col items-start">
          <span className="text-white group-hover:text-accent transition-colors">
            {totalVoyagers} {totalVoyagers === 1 ? 'Voyager' : 'Voyagers'}
          </span>
          <span className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">
            {totalRooms} {totalRooms === 1 ? 'Sanctuary' : 'Sanctuaries'}
          </span>
        </div>
        <ChevronDown size={14} className={`text-gray-500 transition-transform duration-500 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 mt-4 w-[320px] bg-luxury/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl p-6 z-50"
          >
            <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {occupancies.map((room, idx) => (
                <div key={idx} className="space-y-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Sanctuary {idx + 1}</h4>
                    {occupancies.length > 1 && (
                      <button onClick={() => removeRoom(idx)} className="text-gray-500 hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-accent">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] text-white font-medium uppercase tracking-widest">Adults</p>
                        <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Ages 13+</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateRoom(idx, { adults: Math.max(1, room.adults - 1) })}
                        className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white hover:border-accent transition-all"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold text-white w-4 text-center">{room.adults}</span>
                      <button
                        onClick={() => updateRoom(idx, { adults: Math.min(4, room.adults + 1) })}
                        className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white hover:border-accent transition-all"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-accent">
                        <Baby size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] text-white font-medium uppercase tracking-widest">Children</p>
                        <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Ages 0-12</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => addChild(idx)}
                        disabled={room.childrenAges.length >= 3}
                        className="text-[10px] uppercase tracking-widest text-accent font-bold hover:text-white transition-colors disabled:opacity-20"
                      >
                        Add Child
                      </button>
                    </div>
                  </div>

                  {/* Child Age Selectors */}
                  {room.childrenAges.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {room.childrenAges.map((age, childIdx) => (
                        <div key={childIdx} className="relative group">
                          <select
                            value={age}
                            onChange={(e) => updateChildAge(idx, childIdx, parseInt(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-[10px] text-white appearance-none outline-none focus:border-accent"
                          >
                            {Array.from({ length: 13 }).map((_, a) => (
                              <option key={a} value={a} className="bg-luxury text-white">{a} y.o.</option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeChild(idx, childIdx)}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addRoom}
              disabled={occupancies.length >= 4}
              className="w-full mt-6 py-3 border border-dashed border-white/20 rounded-2xl text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-accent hover:border-accent/50 transition-all flex items-center justify-center gap-2 disabled:hidden"
            >
              <Plus size={12} />
              Add Sanctuary
            </button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 py-4 bg-accent text-luxury rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all"
            >
              Confirm Placements
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
