
import React, { useState } from 'react';
import { TeamSelector } from './components/TeamSelector';
import { SquadView } from './components/SquadView';
import { TacticsView } from './components/TacticsView';
import { Dashboard } from './components/Dashboard';
import { LockerRoom } from './components/LockerRoom';
import { MatchEngine } from './components/MatchEngine';
import { GameState, Team, MatchStats, Tactics, HiddenImpact } from './types';
import { Button } from './components/Button';
import { Trophy, Home, Layout, Users, Shield } from 'lucide-react';

const DEFAULT_TACTICS: Tactics = {
  formation: '4-3-3',
  mentality: 'Balanced',
  style: 'Gegenpressing',
  lineup: Array(11).fill(null)
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.TEAM_SELECTION);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [tactics, setTactics] = useState<Tactics>(DEFAULT_TACTICS);
  const [lastMatchStats, setLastMatchStats] = useState<MatchStats | null>(null);
  const [hiddenImpacts, setHiddenImpacts] = useState<HiddenImpact[]>([]);

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setGameState(GameState.DASHBOARD);
  };

  const handleLockerRoomFinish = (impacts: HiddenImpact[]) => {
    setHiddenImpacts(impacts);
    setGameState(GameState.MATCH_DAY);
  };

  const navigateTo = (to: string) => {
    switch(to) {
      case 'DASHBOARD': setGameState(GameState.DASHBOARD); break;
      case 'SQUAD': setGameState(GameState.SQUAD_MANAGEMENT); break;
      case 'TACTICS': setGameState(GameState.TACTICS); break;
      case 'MATCH': setGameState(GameState.LOCKER_ROOM); break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-emerald-400" size={24} />
            <span className="font-black text-xl tracking-tighter italic uppercase">Football <span className="text-emerald-400 underline decoration-4 underline-offset-8">AI</span> Manager</span>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {selectedTeam && (
              <>
                <button onClick={() => navigateTo('DASHBOARD')} className={`p-2 rounded-lg transition-colors ${gameState === GameState.DASHBOARD ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-400 hover:text-white'}`}>
                  <Home size={20} />
                </button>
                <button onClick={() => navigateTo('SQUAD')} className={`p-2 rounded-lg transition-colors ${gameState === GameState.SQUAD_MANAGEMENT ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-400 hover:text-white'}`}>
                  <Users size={20} />
                </button>
                <button onClick={() => navigateTo('TACTICS')} className={`p-2 rounded-lg transition-colors ${gameState === GameState.TACTICS ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-400 hover:text-white'}`}>
                  <Shield size={20} />
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-white/10 ml-4">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: selectedTeam.primaryColor }}></div>
                  <span className="font-black text-xs hidden md:block uppercase tracking-wider">{selectedTeam.shortName}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black">
        {gameState === GameState.TEAM_SELECTION && <TeamSelector onSelect={handleTeamSelect} />}
        
        {gameState === GameState.DASHBOARD && selectedTeam && (
          <Dashboard team={selectedTeam} tactics={tactics} onNavigate={navigateTo} />
        )}

        {gameState === GameState.SQUAD_MANAGEMENT && selectedTeam && (
          <SquadView team={selectedTeam} onContinue={() => navigateTo('DASHBOARD')} />
        )}

        {gameState === GameState.TACTICS && selectedTeam && (
          <TacticsView team={selectedTeam} tactics={tactics} setTactics={setTactics} onContinue={() => navigateTo('DASHBOARD')} />
        )}

        {gameState === GameState.LOCKER_ROOM && selectedTeam && (
          <LockerRoom team={selectedTeam} onContinue={handleLockerRoomFinish} />
        )}

        {gameState === GameState.MATCH_DAY && selectedTeam && (
          <MatchEngine homeTeam={selectedTeam} hiddenImpacts={hiddenImpacts} onFinish={(stats) => { setLastMatchStats(stats); setGameState(GameState.POST_MATCH); }} />
        )}
        
        {gameState === GameState.POST_MATCH && lastMatchStats && (
          <div className="max-w-4xl mx-auto py-24 px-4 text-center">
            <div className="mb-16">
              <div className="inline-block p-6 rounded-full bg-emerald-500/20 mb-10"><Trophy size={80} className="text-emerald-400" /></div>
              <h1 className="text-8xl font-black mb-6 tracking-tighter">FINAL SCORE</h1>
              <p className="text-4xl text-gray-400 font-black">{selectedTeam?.name} {lastMatchStats.homeScore} - {lastMatchStats.awayScore} Opponent</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="glass-panel p-10 rounded-3xl"><p className="text-[10px] text-gray-500 uppercase font-black mb-3 tracking-[0.2em]">Board Verdict</p><p className="text-3xl font-black text-emerald-400">SATISFIED</p></div>
              <div className="glass-panel p-10 rounded-3xl"><p className="text-[10px] text-gray-500 uppercase font-black mb-3 tracking-[0.2em]">Player Sentiment</p><p className="text-3xl font-black">STABLE</p></div>
              <div className="glass-panel p-10 rounded-3xl"><p className="text-[10px] text-gray-500 uppercase font-black mb-3 tracking-[0.2em]">Press Opinion</p><p className="text-3xl font-black">IMPRESSED</p></div>
            </div>
            <div className="flex justify-center gap-6">
              <Button onClick={() => { setHiddenImpacts([]); navigateTo('DASHBOARD'); }} className="!px-12 !py-6 text-xl font-black shadow-2xl" variant="primary">Proceed to Office</Button>
            </div>
          </div>
        )}
      </main>

      <footer className="h-10 border-t border-white/5 bg-black/80 px-6 flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> GEMINI 2.5 ANALYTICS</span>
          <span className="hidden md:inline">MATCH ENGINE v4.2</span>
        </div>
        <div className="flex items-center gap-2">
          <span>AI-DRIVEN FOOTBALL MANAGEMENT</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
