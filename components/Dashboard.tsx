
import React from 'react';
import { Team, Tactics } from '../types';
import { Button } from './Button';
import { Calendar, TrendingUp, Newspaper, Trophy, Users, Shield, Play } from 'lucide-react';
import { PREMIER_LEAGUE_TEAMS } from '../constants';

interface DashboardProps {
  team: Team;
  tactics: Tactics;
  onNavigate: (state: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ team, tactics, onNavigate }) => {
  const nextOpponent = PREMIER_LEAGUE_TEAMS.find(t => t.id !== team.id) || PREMIER_LEAGUE_TEAMS[0];

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Sidebar Info */}
      <div className="lg:col-span-3 space-y-6">
        <div className="glass-panel p-6 rounded-3xl text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border-4 border-emerald-500 mb-4 flex items-center justify-center font-black text-2xl">
            {team.shortName}
          </div>
          <h2 className="text-xl font-black">{team.name}</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Premier League</p>
          <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-bold">1st</p>
              <p className="text-[10px] text-gray-500 uppercase">League Pos</p>
            </div>
            <div>
              <p className="text-lg font-bold">£85M</p>
              <p className="text-[10px] text-gray-500 uppercase">Budget</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-sm uppercase flex items-center gap-2"><Trophy size={16} className="text-yellow-500"/> SEASON GOALS</h3>
          <ul className="space-y-3">
            <li className="text-xs text-gray-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Win Premier League
            </li>
            <li className="text-xs text-gray-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Play Attacking Football
            </li>
            <li className="text-xs text-gray-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div> Reach FA Cup Final
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-6 space-y-8">
        {/* Next Match Banner */}
        <div className="relative rounded-3xl overflow-hidden h-64 shadow-2xl group">
           <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-indigo-900 opacity-80"></div>
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center mix-blend-overlay"></div>
           
           <div className="relative h-full p-10 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest">NEXT MATCH DAY</span>
                <span className="text-white/60 text-xs font-mono">SEP 14, 2024</span>
              </div>
              
              <div className="flex items-center justify-center gap-12">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-black mb-2 border border-white/20">{team.shortName}</div>
                  <p className="text-xs font-bold text-white uppercase">{team.name}</p>
                </div>
                <div className="text-4xl font-black text-white/20 italic">VS</div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-black mb-2 border border-white/20">{nextOpponent.shortName}</div>
                  <p className="text-xs font-bold text-white uppercase">{nextOpponent.name}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => onNavigate('MATCH')} className="flex-1 !py-4 shadow-xl" variant="primary">
                  <Play size={18}/> GO TO MATCH
                </Button>
              </div>
           </div>
        </div>

        {/* News Feed */}
        <div className="space-y-4">
           <h3 className="font-bold flex items-center gap-2"><Newspaper size={18} className="text-indigo-400"/> LATEST NEWS</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
                <p className="text-[10px] text-emerald-400 font-black mb-2 uppercase tracking-widest">TRANSFER RUMOUR</p>
                <h4 className="font-bold text-sm mb-2 leading-tight">Club linked with surprise move for Italian star...</h4>
                <p className="text-xs text-gray-500">Board considering £45M bid for Federico Chiesa from Liverpool.</p>
              </div>
              <div className="glass-panel p-5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
                <p className="text-[10px] text-indigo-400 font-black mb-2 uppercase tracking-widest">PRESS CONFERENCE</p>
                <h4 className="font-bold text-sm mb-2 leading-tight">Manager praises squad mentality ahead of local derby</h4>
                <p className="text-xs text-gray-500">"The boys are ready," says the gaffer after training sessions.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Quick Nav / Widgets */}
      <div className="lg:col-span-3 space-y-6">
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="font-bold text-sm uppercase mb-4 flex items-center gap-2"><Users size={16} className="text-emerald-400"/> QUICK ACTIONS</h3>
          <div className="space-y-2">
            <button onClick={() => onNavigate('SQUAD')} className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-3 text-left transition-all">
              <Users size={18} className="text-emerald-400"/>
              <div>
                <p className="font-bold text-sm">Squad View</p>
                <p className="text-[10px] text-gray-500">Review players & stats</p>
              </div>
            </button>
            <button onClick={() => onNavigate('TACTICS')} className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-3 text-left transition-all">
              <Shield size={18} className="text-indigo-400"/>
              <div>
                <p className="font-bold text-sm">Tactics Board</p>
                <p className="text-[10px] text-gray-500">{tactics.formation} • {tactics.style}</p>
              </div>
            </button>
            <button className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-3 text-left transition-all opacity-50 cursor-not-allowed">
              <Calendar size={18} className="text-yellow-400"/>
              <div>
                <p className="font-bold text-sm">Schedule</p>
                <p className="text-[10px] text-gray-500">View upcoming fixtures</p>
              </div>
            </button>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl bg-emerald-500/5">
           <h3 className="font-bold text-sm uppercase mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-emerald-400"/> FORM GUIDE</h3>
           <div className="flex gap-2">
             <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">W</div>
             <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">W</div>
             <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-xs">D</div>
             <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">W</div>
             <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs">L</div>
           </div>
        </div>
      </div>
    </div>
  );
};
