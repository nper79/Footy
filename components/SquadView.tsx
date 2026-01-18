
import React from 'react';
import { Team, Player } from '../types';
import { Button } from './Button';
import { ChevronRight, Zap, Target, Shield, Activity, Users } from 'lucide-react';

interface SquadViewProps {
  team: Team;
  onContinue: () => void;
}

export const SquadView: React.FC<SquadViewProps> = ({ team, onContinue }) => {
  const avgRating = Math.round(team.squad.reduce((acc, p) => acc + p.rating, 0) / team.squad.length);
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-10 rounded-full" style={{ backgroundColor: team.primaryColor }}></div>
            <h1 className="text-4xl font-black tracking-tighter">{team.name.toUpperCase()}</h1>
          </div>
          <p className="text-gray-400">Squad Depth: {team.squad.length} Players • Avg. Rating: {avgRating}</p>
        </div>
        <Button onClick={onContinue} variant="primary" className="w-full md:w-auto">
          Start Pre-Match Talk <ChevronRight size={18} />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 glass-panel rounded-2xl overflow-hidden flex flex-col max-h-[60vh]">
          <div className="overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4">Player</th>
                  <th className="px-6 py-4">Pos</th>
                  <th className="px-6 py-4">PAC</th>
                  <th className="px-6 py-4">SHO</th>
                  <th className="px-6 py-4">PAS</th>
                  <th className="px-6 py-4">DRI</th>
                  <th className="px-6 py-4">DEF</th>
                  <th className="px-6 py-4">PHY</th>
                  <th className="px-6 py-4 text-emerald-400">OVR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {team.squad.map((player) => (
                  <tr key={player.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs">
                          {player.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold group-hover:text-emerald-400 transition-colors text-sm">{player.name}</p>
                          <div className="flex gap-1 mt-1">
                            {player.traits.slice(0, 2).map(t => (
                              <span key={t} className="text-[7px] bg-white/10 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter opacity-60">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-mono px-2 py-1 rounded ${
                        player.position === 'FWD' ? 'bg-red-500/10 text-red-400' :
                        player.position === 'MID' ? 'bg-blue-500/10 text-blue-400' :
                        player.position === 'DEF' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {player.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">{player.attributes.pac}</td>
                    <td className="px-6 py-4 text-xs font-mono">{player.attributes.sho}</td>
                    <td className="px-6 py-4 text-xs font-mono">{player.attributes.pas}</td>
                    <td className="px-6 py-4 text-xs font-mono">{player.attributes.dri}</td>
                    <td className="px-6 py-4 text-xs font-mono">{player.attributes.def}</td>
                    <td className="px-6 py-4 text-xs font-mono">{player.attributes.phy}</td>
                    <td className="px-6 py-4">
                      <span className="font-black text-emerald-400 text-lg">{player.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-yellow-400">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-yellow-400" size={20} />
              <h3 className="font-bold text-sm uppercase tracking-widest">Speed Profile</h3>
            </div>
            <p className="text-2xl font-black">High</p>
            <p className="text-xs text-gray-400 mt-1">Your team excels in counter-attacks and wing play.</p>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-emerald-400">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-emerald-400" size={20} />
              <h3 className="font-bold text-sm uppercase tracking-widest">Cohesion</h3>
            </div>
            <p className="text-2xl font-black">82%</p>
            <p className="text-xs text-gray-400 mt-1">Players are familiar with your tactical philosophy.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-l-4 border-indigo-400">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-indigo-400" size={20} />
              <h3 className="font-bold text-sm uppercase tracking-widest">Efficiency</h3>
            </div>
            <p className="text-2xl font-black">1.8 xG</p>
            <p className="text-xs text-gray-400 mt-1">Average expected goals per match this season.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
