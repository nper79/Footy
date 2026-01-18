
export interface Stats {
  pac: number;
  sho: number;
  pas: number;
  dri: number;
  def: number;
  phy: number;
}

export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  rating: number;
  morale: number; 
  fitness: number;
  traits: string[];
  attributes: Stats;
}

export type Formation = '4-3-3' | '4-4-2' | '4-2-3-1' | '3-5-2' | '5-3-2';
export type Mentality = 'Defensive' | 'Balanced' | 'Attacking' | 'All-out Attack';
export type PlayStyle = 'Gegenpressing' | 'Tiki-Taka' | 'Route One' | 'Park the Bus';

export interface Tactics {
  formation: Formation;
  mentality: Mentality;
  style: PlayStyle;
  lineup: (string | null)[]; // Array of 11 player IDs
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  stadium: string;
  squad: Player[];
}

export interface HiddenImpact {
  playerId: string;
  performanceMod: number; // -5 to +5
  moraleImpact: string; // 'Inspired', 'Confused', 'Bored'
}

export enum GameState {
  TEAM_SELECTION = 'TEAM_SELECTION',
  DASHBOARD = 'DASHBOARD',
  SQUAD_MANAGEMENT = 'SQUAD_MANAGEMENT',
  TACTICS = 'TACTICS',
  LOCKER_ROOM = 'LOCKER_ROOM',
  MATCH_DAY = 'MATCH_DAY',
  POST_MATCH = 'POST_MATCH'
}

export type MatchPhase = 'HOME_ATTACK' | 'AWAY_ATTACK' | 'MIDFIELD_BATTLE' | 'GOAL_CELEBRATION' | 'KICK_OFF';

export interface MatchStats {
  homeScore: number;
  awayScore: number;
  possession: number;
  shots: number;
  onTarget: number;
  minute: number;
  phase: MatchPhase;
  events: MatchEvent[];
}

export interface MatchEvent {
  minute: number;
  type: 'GOAL' | 'YELLOW' | 'RED' | 'CHANCE' | 'COMMENTARY';
  description: string;
  team: 'HOME' | 'AWAY';
}
