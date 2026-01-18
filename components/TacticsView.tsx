
import React, { useState } from 'react';
import { Tactics, Formation, Mentality, PlayStyle, Team, Player } from '../types';
import { Button } from './Button';
import { Shield, Zap, Target, Layout, Activity, UserPlus, X, Users } from 'lucide-react';

interface TacticsViewProps {
  team: Team;
  tactics: Tactics;
  setTactics: (t: Tactics) => void;
  onContinue: () => void;
}

const FORMATIONS: Formation[] = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2'];
const MENTALITIES: Mentality[] = ['Defensive', 'Balanced', 'Attacking', 'All-out Attack'];
const STYLES: PlayStyle[] = ['Gegenpressing', 'Tiki-Taka', 'Route One', 'Park the Bus'];

// Coordinates for slots based on 4-3-3 as default
const getSlotPositions = (formation: Formation) => {
  const slots = [{ label: 'GK', x: 50, y: 88 }]; // Perfectly centered on Y-axis goal area
  
  if (formation === '4-3-3') {
    slots.push(
      { label: 'LB', x: 15, y: 70 }, { label: 'CB', x: 38, y: 75 }, { label: 'CB', x: 62, y: 75 }, { label: 'RB', x: 85, y: 70 },
      { label: 'CM', x: 30, y: 45 }, { label: 'CDM', x: 50, y: 55 }, { label: 'CM', x: 70, y: 45 },
      { label: 'LW', x: 20, y: 22 }, { label: 'ST', x: 50, y: 15 }, { label: 'RW', x: 80, y: 22 }
    );
  } else if (formation === '4-4-2') {
    slots.push(
      { label: 'LB', x: 15, y: 70 }, { label: 'CB', x: 38, y: 75 }, { label: 'CB', x: 62, y: 75 }, { label: 'RB', x: 85, y: 70 },
      { label: 'LM', x: 15, y: 45 }, { label: 'CM', x: 40, y: 48 }, { label: 'CM', x: 60, y: 48 }, { label: 'RM', x: 85, y: 45 },
      { label: 'ST', x: 38, y: 18 }, { label: 'ST', x: 62, y: 18 }
    );
  } else if (formation === '4-2-3-1') {
    slots.push(
      { label: 'LB', x: 15, y: 72 }, { label: 'LCB', x: 38, y: 77 }, { label: 'RCB', x: 62, y: 77 }, { label: 'RB', x: 85, y: 72 },
      { label: 'LDM', x: 38, y: 58 }, { label: 'RDM', x: 62, y: 58 },
      { label: 'LAM', x: 20, y: 35 }, { label: 'CAM', x: 50, y: 35 }, { label: 'RAM', x: 80, y: 35 },
      { label: 'ST', x: 50, y: 15 }
    );
  } else if (formation === '3-5-2') {
    slots.push(
      { label: 'LCB', x: 30, y: 75 }, { label: 'CB', x: 50, y: 77 }, { label: 'RCB', x: 70, y: 75 },
      { label: 'LWB', x: 15, y: 45 }, { label: 'LCM', x: 35, y: 50 }, { label: 'CDM', x: 50, y: 55 }, { label: 'RCM', x: 65, y: 50 }, { label: 'RWB', x: 85, y: 45 },
      { label: 'LST', x: 40, y: 18 }, { label: 'RST', x: 60, y: 18 }
    );
  } else if (formation === '5-3-2') {
    slots.push(
      { label: 'LWB', x: 12, y: 65 }, { label: 'LCB', x: 30, y: 75 }, { label: 'CB', x: 50, y: 77 }, { label: 'RCB', x: 70, y: 75 }, { label: 'RWB', x: 88, y: 65 },
      { label: 'LCM', x: 35, y: 48 }, { label: 'CM', x: 50, y: 50 }, { label: 'RCM', x: 65, y: 48 },
      { label: 'LST', x: 40, y: 18 }, { label: 'RST', x: 60, y: 18 }
    );
  }
  return slots;
};

export const TacticsView: React.FC<TacticsViewProps> = ({ team, tactics, setTactics, onContinue }) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const assignPlayerToSlot = (playerId: string) => {
    if (selectedSlotIndex === null) return;
    
    const newLineup = [...tactics.lineup];
    // If player is already in another slot, remove them from there
    const existingIndex = newLineup.indexOf(playerId);
    if (existingIndex !== -1) newLineup[existingIndex] = null;
    
    newLineup[selectedSlotIndex] = playerId;
    setTactics({ ...tactics, lineup: newLineup });
    setSelectedSlotIndex(null);
  };

  const removePlayerFromSlot = (index: number) => {
    const newLineup = [...tactics.lineup];
    newLineup[index] = null;
    setTactics({ ...tactics, lineup: newLineup });
  };

  const slots = getSlotPositions(tactics.formation);
  const startingCount = tactics.lineup.filter(id => id !== null).length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col h-full gap-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">TACTICAL COMMAND</h1>
          <p className="text-gray-400">Drag or select players into your starting eleven. ({startingCount}/11 selected)</p>
        </div>
        <Button onClick={onContinue} variant="primary" disabled={startingCount < 11} className="w-full md:w-auto">
          Confirm Selection
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left: Squad Pool */}
        <div className="lg:col-span-3 glass-panel rounded-3xl overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Users size={14} /> AVAILABLE SQUAD
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {team.squad.map((player) => {
              const isStarting = tactics.lineup.includes(player.id);
              return (
                <button
                  key={player.id}
                  disabled={selectedSlotIndex === null && !isStarting}
                  onClick={() => selectedSlotIndex !== null ? assignPlayerToSlot(player.id) : null}
                  className={`w-full p-3 rounded-xl flex items-center justify-between transition-all group ${
                    isStarting ? 'opacity-40 cursor-not-allowed bg-white/5 border border-white/5' : 
                    selectedSlotIndex !== null ? 'hover:bg-emerald-500/20 border border-emerald-500/20 cursor-pointer shadow-lg' : 'opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-[10px] border border-white/10">
                      {player.rating}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold">{player.name}</p>
                      <p className="text-[10px] text-gray-500">{player.position}</p>
                    </div>
                  </div>
                  {selectedSlotIndex !== null && !isStarting && <UserPlus size={14} className="text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Interactive Pitch */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-4 bg-[#1a381a] relative shadow-inner overflow-hidden border-2 border-white/10">
          {/* Pitch Markings */}
          <div className="absolute inset-8 border-2 border-white/20 rounded-xl pointer-events-none">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full"></div>
            {/* Goal boxes */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-b-0 border-white/20"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-12 border border-b-0 border-white/20"></div>
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-t-0 border-white/20"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 border border-t-0 border-white/20"></div>
          </div>

          <div className="relative w-full h-[600px]">
            {slots.map((slot, index) => {
              const playerId = tactics.lineup[index];
              const player = team.squad.find(p => p.id === playerId);
              const isActive = selectedSlotIndex === index;

              return (
                <div 
                  key={index}
                  className="absolute transition-all duration-500 flex flex-col items-center"
                  style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <button
                    onClick={() => setSelectedSlotIndex(isActive ? null : index)}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-all flex items-center justify-center relative shadow-2xl ${
                      player 
                        ? 'bg-emerald-600 border-white text-white scale-110' 
                        : isActive 
                        ? 'bg-emerald-400/20 border-emerald-400 border-dashed animate-pulse ring-4 ring-emerald-500/20' 
                        : 'bg-black/40 border-white/20 hover:border-white/40'
                    }`}
                  >
                    {player ? (
                      <span className="font-black text-[10px] text-center leading-tight">
                        {player.name.split(' ').pop()?.toUpperCase()}
                      </span>
                    ) : (
                      <UserPlus size={16} className="text-white/20" />
                    )}
                    
                    {player && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removePlayerFromSlot(index); }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border border-white hover:scale-125 transition-transform z-20"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </button>
                  <div className={`mt-2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter shadow-md ${player ? 'bg-black/80' : 'bg-white/5 text-gray-500'}`}>
                    {player ? player.name.split(' ').pop() : slot.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Tactical Settings */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-emerald-400"><Layout size={18}/> Formation</h3>
            <div className="grid grid-cols-2 gap-2">
              {FORMATIONS.map(f => (
                <button 
                  key={f} 
                  onClick={() => setTactics({...tactics, formation: f, lineup: Array(11).fill(null)})}
                  className={`p-3 rounded-xl text-[10px] font-black border transition-all ${tactics.formation === f ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-3 text-center italic">Formation changes reset the starting XI.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-indigo-400"><Activity size={18}/> Mentality</h3>
            <div className="flex flex-col gap-2">
              {MENTALITIES.map(m => (
                <button 
                  key={m} 
                  onClick={() => setTactics({...tactics, mentality: m})}
                  className={`p-3 rounded-xl text-xs font-bold border text-left flex justify-between items-center transition-all ${tactics.mentality === m ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                >
                  {m}
                  {tactics.mentality === m && <Shield size={14}/>}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-yellow-400"><Zap size={18}/> Playing Style</h3>
            <div className="flex flex-col gap-2">
              {STYLES.map(s => (
                <button 
                  key={s} 
                  onClick={() => setTactics({...tactics, style: s})}
                  className={`p-3 rounded-xl text-xs font-bold border text-left flex justify-between items-center transition-all ${tactics.style === s ? 'bg-yellow-600 border-yellow-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                >
                  {s}
                  {tactics.style === s && <Target size={14}/>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
