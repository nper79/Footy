
import React, { useState, useEffect } from 'react';
import { Team, MatchStats, MatchPhase, HiddenImpact, MatchEvent } from '../types';
import { Button } from './Button';
import { Mic, Volume2, Target, AlertCircle, Play, ChevronRight, Activity } from 'lucide-react';
import { PitchView } from './PitchView';

interface MatchEngineProps {
  homeTeam: Team;
  hiddenImpacts: HiddenImpact[];
  onFinish: (stats: MatchStats) => void;
}

const OPPONENT: Team = {
  id: 'opp',
  name: 'Manchester United',
  shortName: 'MUN',
  primaryColor: '#DA291C',
  secondaryColor: '#ffffff',
  stadium: 'Arena',
  squad: [
     // Minimal mock squad for opponent to make Physics Engine work if needed
     { id: 'op1', name: 'Onana', position: 'GK', rating: 83, attributes: { pac: 50, sho: 20, pas: 70, dri: 50, def: 80, phy: 80 }, traits: [], morale: 80, fitness: 100 },
     { id: 'op2', name: 'Dalot', position: 'DEF', rating: 81, attributes: { pac: 80, sho: 60, pas: 75, dri: 78, def: 79, phy: 75 }, traits: [], morale: 80, fitness: 100 },
     { id: 'op3', name: 'Varane', position: 'DEF', rating: 84, attributes: { pac: 75, sho: 40, pas: 65, dri: 60, def: 86, phy: 82 }, traits: [], morale: 80, fitness: 100 },
     { id: 'op4', name: 'Martinez', position: 'DEF', rating: 83, attributes: { pac: 76, sho: 50, pas: 78, dri: 70, def: 85, phy: 84 }, traits: [], morale: 80, fitness: 100 },
     { id: 'op5', name: 'Shaw', position: 'DEF', rating: 82, attributes: { pac: 78, sho: 60, pas: 80, dri: 78, def: 80, phy: 80 }, traits: [], morale: 80, fitness: 100 },
     { id: 'op6', name: 'Casemiro', position: 'MID', rating: 87, attributes: { pac: 60, sho: 70, pas: 80, dri: 70, def: 88, phy: 88 }, traits: [], morale: 80, fitness: 100 },
     { id: 'op7', name: 'Mainoo', position: 'MID', rating: 78, attributes: { pac: 75, sho: 65, pas: 80, dri: 82, def: 70, phy: 70 }, traits: [], morale: 80, fitness: 100 },
     { id: 'op8', name: 'Fernandes', position: 'MID', rating: 88, attributes: { pac: 75, sho: 85, pas: 90, dri: 84, def: 60, phy: 70 }, traits: [], morale: 80, fitness: 100 },
     { id: 'op9', name: 'Antony', position: 'FWD', rating: 80, attributes: { pac: 85, sho: 75, pas: 70, dri: 86, def: 40, phy: 60 }, traits: [], morale: 80, fitness: 100 },
     { id: 'op10', name: 'Hojlund', position: 'FWD', rating: 80, attributes: { pac: 86, sho: 80, pas: 60, dri: 75, def: 30, phy: 82 }, traits: [], morale: 80, fitness: 100 },
     { id: 'op11', name: 'Rashford', position: 'FWD', rating: 84, attributes: { pac: 90, sho: 84, pas: 75, dri: 85, def: 40, phy: 74 }, traits: [], morale: 80, fitness: 100 }
  ]
};

export const MatchEngine: React.FC<MatchEngineProps> = ({ homeTeam, hiddenImpacts, onFinish }) => {
  const [stats, setStats] = useState<MatchStats>({
    homeScore: 0,
    awayScore: 0,
    possession: 50,
    shots: 0,
    onTarget: 0,
    minute: 0,
    phase: 'KICK_OFF',
    events: []
  });

  const [shout, setShout] = useState('');
  const [activeShout, setActiveShout] = useState<string | null>(null);

  // Callback from the Physics Engine
  const handleMatchUpdate = (time: number, homeScore: number, awayScore: number, event?: MatchEvent) => {
    setStats(prev => {
      const newEvents = event ? [event, ...prev.events] : prev.events;
      return {
        ...prev,
        minute: Math.floor(time),
        homeScore,
        awayScore,
        events: newEvents.slice(0, 50)
      };
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 flex flex-col h-full gap-8">
      {/* Scoreboard Hub */}
      <div className="glass-panel rounded-3xl p-8 flex items-center justify-between border-b-8 border-emerald-500 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
        <div className="flex-1 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl mb-3">{homeTeam.shortName}</div>
          <h2 className="text-xl font-black uppercase tracking-tighter">{homeTeam.name}</h2>
        </div>
        
        <div className="px-12 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] font-black text-emerald-400 mb-4 tracking-widest">
            <Play size={10} fill="currentColor" /> {stats.minute === 0 ? 'KICK OFF' : stats.minute >= 90 ? 'FULL TIME' : `${stats.minute}' LIVE`}
          </div>
          <div className="text-8xl font-black tracking-tighter tabular-nums flex gap-4">
            <span>{stats.homeScore}</span>
            <span className="text-white/20">:</span>
            <span>{stats.awayScore}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl mb-3">{OPPONENT.shortName}</div>
          <h2 className="text-xl font-black uppercase tracking-tighter">{OPPONENT.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Tactical Pitch Visualizer (Now Running the Physics Engine) */}
        <div className="lg:col-span-8 space-y-8 flex flex-col">
          <PitchView 
            phase={stats.phase} 
            homeTeam={homeTeam} 
            awayTeam={OPPONENT} 
            hiddenImpacts={hiddenImpacts}
            onMatchUpdate={handleMatchUpdate}
          />
          
          <div className="glass-panel rounded-3xl flex-1 flex flex-col overflow-hidden shadow-xl border border-white/5">
            <div className="p-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest"><Volume2 size={18} className="text-emerald-400" /> Match Feed</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {stats.events.map((event, i) => (
                <div key={i} className={`flex gap-6 p-5 rounded-2xl transition-all ${event.type === 'GOAL' ? 'bg-emerald-500/20 border-2 border-emerald-500 shadow-lg scale-[1.02]' : 'bg-white/5 border border-white/5 hover:bg-white/10'}`}>
                  <span className="font-mono text-sm font-black text-emerald-400">{event.minute}'</span>
                  <div className="flex-1">
                    {event.type === 'GOAL' && <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 block">GOAL SCORED!</span>}
                    <p className="text-sm md:text-base leading-relaxed font-medium">{event.description}</p>
                  </div>
                </div>
              ))}
              {stats.events.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 opacity-50">
                  <Activity size={48} />
                  <p className="uppercase tracking-widest text-xs font-bold">Waiting for kick-off...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manager Touchline Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-8 bg-indigo-500/5 border border-indigo-500/20 shadow-xl">
             <div className="flex items-center gap-3 mb-6 text-indigo-400">
               <Mic size={24} />
               <h3 className="font-bold uppercase tracking-widest text-sm">Touchline Shouts</h3>
             </div>
             <div className="space-y-4">
               <textarea 
                 value={shout}
                 onChange={e => setShout(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && shout.trim() && (setActiveShout(shout), setShout(''))}
                 placeholder="Demand more, tighten up, or scream 'GO! GO! GO!'..."
                 className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500 h-32 resize-none transition-all placeholder:text-gray-700"
               />
               <Button onClick={() => { if(shout.trim()) { setActiveShout(shout); setShout(''); } }} className="w-full !py-4 font-black shadow-lg shadow-indigo-500/20" variant="secondary">
                 TRANSMIT INSTRUCTION
               </Button>
             </div>
             {activeShout && (
               <div className="mt-6 p-4 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 animate-in fade-in slide-in-from-top-2">
                 <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2"><AlertCircle size={12}/> Shout heard by squad</p>
                 <p className="text-sm italic text-gray-200">"{activeShout}"</p>
               </div>
             )}
          </div>

          <div className="glass-panel rounded-3xl p-8 flex-1 border border-white/5 shadow-xl">
             <div className="flex items-center gap-3 mb-8">
               <Target size={20} className="text-emerald-400" />
               <h3 className="font-bold uppercase tracking-widest text-sm">Real-time Analytics</h3>
             </div>
             <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5">
                    <p className="text-3xl font-black tracking-tighter">{stats.homeScore + stats.awayScore + 2}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Total Chances</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5">
                    <p className="text-3xl font-black tracking-tighter text-indigo-400">{Math.floor(stats.minute / 8) + 1}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Yellow Cards</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4">Tactical Status</p>
                   <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20">GEGENPRESSING</span>
                      <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-full border border-indigo-500/20">FLUID</span>
                      {hiddenImpacts.length > 0 && <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-[10px] font-black rounded-full border border-yellow-500/20 uppercase">Talk Boost Active</span>}
                   </div>
                </div>
             </div>
             
             {stats.minute >= 90 && (
               <Button onClick={() => onFinish(stats)} className="w-full mt-10 !py-4 shadow-2xl" variant="primary">
                 End Match & View Report <ChevronRight size={20} />
               </Button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
