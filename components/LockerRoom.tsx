
import React, { useState } from 'react';
import { Team, Player, HiddenImpact } from '../types';
import { Button } from './Button';
import { MessageSquare, Send, Users, ChevronRight, Activity } from 'lucide-react';
import { analyzeTeamTalk } from '../services/geminiService';

interface LockerRoomProps {
  team: Team;
  onContinue: (impacts: HiddenImpact[]) => void;
}

export const LockerRoom: React.FC<LockerRoomProps> = ({ team, onContinue }) => {
  const [speech, setSpeech] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalReaction, setGeneralReaction] = useState<string | null>(null);
  const [impacts, setImpacts] = useState<HiddenImpact[]>([]);

  const handleTeamTalk = async () => {
    if (!speech.trim()) return;

    setLoading(true);
    try {
      const result = await analyzeTeamTalk(speech, team.squad, team.name);
      setGeneralReaction(result.generalReaction);
      setImpacts(result.impacts);
    } catch (error) {
      console.error(error);
      setGeneralReaction("The players look at you, waiting for more clarity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">PRE-MATCH TEAM TALK</h1>
          <p className="text-gray-400">The squad is gathered. Silence falls. What do you have to say?</p>
        </div>
        <Button 
          onClick={() => onContinue(impacts)} 
          variant="primary" 
          disabled={!generalReaction}
          className="shadow-2xl shadow-emerald-500/20"
        >
          Head to Pitch <ChevronRight size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
        {/* Manager Input */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-8 flex flex-col gap-6 border-l-4 border-indigo-500">
            <div className="flex items-center gap-3 text-indigo-400">
              <MessageSquare size={24} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Manager's Address</h3>
            </div>
            <textarea
              value={speech}
              onChange={(e) => setSpeech(e.target.value)}
              placeholder="Tell them to play with passion, stay calm, or demand a win..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[250px] focus:outline-none focus:border-indigo-500 transition-all text-lg leading-relaxed placeholder:text-gray-600"
            />
            <Button 
              onClick={handleTeamTalk} 
              disabled={loading || !speech.trim() || !!generalReaction}
              variant="secondary"
              className="!py-4 text-lg font-black"
            >
              {loading ? 'Sensing the room...' : 'Address the Squad'} <Send size={20} />
            </Button>
          </div>

          {generalReaction && (
            <div className="glass-panel rounded-3xl p-8 border-l-4 border-emerald-500 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 text-emerald-400 mb-4">
                <Activity size={20} />
                <h3 className="font-bold uppercase tracking-widest text-sm">Room Atmosphere</h3>
              </div>
              <p className="text-xl italic font-serif leading-relaxed text-gray-200">"{generalReaction}"</p>
              <p className="mt-6 text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">The specific impact on each player remains hidden until the whistle blows.</p>
            </div>
          )}
        </div>

        {/* Squad Status */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-full max-h-[700px]">
            <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <Users size={16} /> SQUAD RECEPTIVITY
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {team.squad.map((player) => (
                <div key={player.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs border border-white/10">
                      {player.rating}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{player.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{player.position}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`w-2 h-2 rounded-full ${generalReaction ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`}></div>
                    <span className="text-[8px] text-gray-600 font-bold uppercase mt-1">{generalReaction ? 'REACTION RECORDED' : 'AWAITING SPEECH'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
