
import React from 'react';
import { PREMIER_LEAGUE_TEAMS } from '../constants';
import { Team } from '../types';
import { Button } from './Button';
import { Trophy, Users, Shield } from 'lucide-react';

interface TeamSelectorProps {
  onSelect: (team: Team) => void;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({ onSelect }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          CHOOSE YOUR DYNASTY
        </h1>
        <p className="text-gray-400 text-lg">Take control of a Premier League giant and lead them to glory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PREMIER_LEAGUE_TEAMS.map((team) => (
          <div 
            key={team.id}
            className="glass-panel rounded-2xl overflow-hidden group hover:border-emerald-500/50 transition-all duration-300"
          >
            <div 
              className="h-24 flex items-center justify-center relative"
              style={{ backgroundColor: team.primaryColor }}
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
              <h2 className="text-3xl font-black text-white drop-shadow-md z-10">{team.shortName}</h2>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">{team.name}</h3>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Shield size={16} className="text-emerald-400" />
                  <span>Stadium: {team.stadium}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Users size={16} className="text-emerald-400" />
                  <span>Key Players: {team.squad.length} Stars</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Trophy size={16} className="text-emerald-400" />
                  <span>Reputation: World Class</span>
                </div>
              </div>

              <Button 
                onClick={() => onSelect(team)}
                className="w-full"
                variant="primary"
              >
                Select {team.name}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
