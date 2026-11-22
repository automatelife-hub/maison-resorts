'use client';

import React, { useState, useRef, useEffect } from 'react';
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
        className="w-full flex items-center justify-between text-gray-800 text-sm font-medium group py-2 border-b border-gray-200"
      >
        <div className="flex flex-col items-start">
          <span className="text-white group-hover:text-accent transition-colors">
            {totalVoyagers} {totalVoyagers === 1 ? 'Guest' : 'Guests'}
          </span>
          <span className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">
            {totalRooms} {totalRooms === 1 ? 'Room' : 'Rooms'}
          </span>
        </div>
        <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gray-800' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[320px] bg-white border border-gray-200 rounded-lg shadow-xl p-6 z-50">
          <div className="space-y-6 max-h-[350px] overflow-y-auto pr-1">
            {occupancies.map((room, idx) => (
              <div key={idx} className="space-y-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Room {idx + 1}</h4>
                  {occupancies.length > 1 && (
                    <button onClick={() => removeRoom(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-800 font-medium">Adults</p>
                      <p className="text-[10px] text-gray-400">Ages 13+</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateRoom(idx, { adults: Math.max(1, room.adults - 1) })}
                      className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold text-gray-800 w-4 text-center">{room.adults}</span>
                    <button
                      type="button"
                      onClick={() => updateRoom(idx, { adults: Math.min(4, room.adults + 1) })}
                      className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                      <Baby size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-800 font-medium">Children</p>
                      <p className="text-[10px] text-gray-400">Ages 0-12</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => addChild(idx)}
                      disabled={room.childrenAges.length >= 3}
                      className="text-xs font-semibold text-gray-700 hover:text-gray-900 disabled:opacity-20 transition-colors"
                    >
                      Add Child
                    </button>
                  </div>
                </div>

                {/* Child Age Selectors */}
                {room.childrenAges.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {room.childrenAges.map((age, childIdx) => (
                      <div key={childIdx} className="relative group">
                        <select
                          value={age}
                          onChange={(e) => updateChildAge(idx, childIdx, parseInt(e.target.value))}
                          className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 appearance-none outline-none focus:border-gray-400"
                        >
                          {Array.from({ length: 13 }).map((_, a) => (
                            <option key={a} value={a} className="bg-white text-gray-800">{a} y.o.</option>
                          ))}
                        </select>
                        <button
                          type="button"
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
            type="button"
            onClick={addRoom}
            disabled={occupancies.length >= 4}
            className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:text-gray-800 hover:border-gray-400 transition-all flex items-center justify-center gap-1 disabled:hidden"
          >
            <Plus size={12} />
            Add Room
          </button>
          
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
