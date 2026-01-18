
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Team, MatchPhase, HiddenImpact, MatchEvent } from '../types';

interface PitchViewProps {
  phase: MatchPhase; // Kept for interface compatibility, though engine drives phases internally
  homeTeam: Team;
  awayTeam: Team;
  hiddenImpacts: HiddenImpact[];
  onMatchUpdate: (time: number, homeScore: number, awayScore: number, event?: MatchEvent) => void;
  gameSpeed?: number;
}

const PITCH_WIDTH = 800;
const PITCH_HEIGHT = 500;
const PLAYER_RADIUS = 10;
const BALL_RADIUS = 5;
const GOAL_WIDTH = 70;

const FRICTION = 0.92;
const BALL_FRICTION = 0.97;
const BASE_MAX_SPEED = 2.6;
const SPRINT_SPEED_MULTI = 1.3;
const PLAYER_ACCELERATION = 0.18;
const PASS_SPEED = 7;
const SHOT_POWER = 12;
const CONTROL_DISTANCE = 20;
const DRIBBLE_OFFSET = 12;

interface PhysicsPlayer {
  id: string; // matches Player.id
  team: 'home' | 'away';
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  role: 'GK' | 'DEF' | 'MID' | 'FWD';
  line: number;
  number: number;
  name: string;
  // Attributes derived from Team data
  speedStats: number;
  passStats: number;
  shootStats: number;
  defStats: number;
  creativity: number;
  runTimer: number;
}

const createFormation = (isHome: boolean) => {
  const dir = isHome ? 1 : -1;
  const gkX = isHome ? 35 : PITCH_WIDTH - 35;
  const defX = isHome ? 130 : PITCH_WIDTH - 130;
  const midX = isHome ? 300 : PITCH_WIDTH - 300;
  const attX = isHome ? 450 : PITCH_WIDTH - 450;
  
  // 4-3-3 formation
  return [
    { baseX: gkX, baseY: PITCH_HEIGHT / 2, role: 'GK', line: 0 },
    { baseX: defX, baseY: PITCH_HEIGHT * 0.1, role: 'DEF', line: 1 }, // RB/LB
    { baseX: defX - dir * 15, baseY: PITCH_HEIGHT * 0.35, role: 'DEF', line: 1 }, // CB
    { baseX: defX - dir * 15, baseY: PITCH_HEIGHT * 0.65, role: 'DEF', line: 1 }, // CB
    { baseX: defX, baseY: PITCH_HEIGHT * 0.9, role: 'DEF', line: 1 }, // LB/RB
    { baseX: midX, baseY: PITCH_HEIGHT * 0.15, role: 'MID', line: 2 }, // CM
    { baseX: midX - dir * 20, baseY: PITCH_HEIGHT * 0.5, role: 'MID', line: 2 }, // CDM
    { baseX: midX, baseY: PITCH_HEIGHT * 0.85, role: 'MID', line: 2 }, // CM
    { baseX: attX, baseY: PITCH_HEIGHT * 0.2, role: 'FWD', line: 3 }, // RW/LW
    { baseX: attX + dir * 20, baseY: PITCH_HEIGHT * 0.5, role: 'FWD', line: 3 }, // ST
    { baseX: attX, baseY: PITCH_HEIGHT * 0.8, role: 'FWD', line: 3 }, // LW/RW
  ];
};

const distance = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

export const PitchView: React.FC<PitchViewProps> = ({ homeTeam, awayTeam, hiddenImpacts, onMatchUpdate, gameSpeed = 1 }) => {
  // Game State
  const [time, setTime] = useState(0);
  const [ball, setBall] = useState({ x: PITCH_WIDTH / 2, y: PITCH_HEIGHT / 2, vx: 0, vy: 0, targetPlayer: null as { team: string, id: string } | null, isShot: false });
  const [players, setPlayers] = useState<{ home: PhysicsPlayer[], away: PhysicsPlayer[] }>({ home: [], away: [] });
  const [possession, setPossession] = useState<{ team: 'home' | 'away' | null, playerId: string | null }>({ team: null, playerId: null });
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [isGoalScored, setIsGoalScored] = useState(false);

  // Refs for loop
  const requestRef = useRef<number>(0);
  const possessionStartRef = useRef(0);
  const previousPossessorRef = useRef<{ team: string, id: string } | null>(null);
  const pickupCooldownRef = useRef<{[key: string]: number}>({});

  // Initialize Players
  useEffect(() => {
    const initTeam = (teamData: Team, isHome: boolean): PhysicsPlayer[] => {
      const formation = createFormation(isHome);
      // Map squad to formation (first 11)
      return formation.map((pos, i) => {
        const squadPlayer = teamData.squad[i] || teamData.squad[0];
        
        // Normalize attributes to multipliers
        const speedMult = squadPlayer.attributes.pac / 100;
        const passMult = squadPlayer.attributes.pas / 100;
        const shootMult = squadPlayer.attributes.sho / 100;
        const defMult = squadPlayer.attributes.def / 100;

        return {
          ...pos,
          id: squadPlayer.id,
          team: isHome ? 'home' : 'away',
          x: pos.baseX,
          y: pos.baseY,
          vx: 0,
          vy: 0,
          number: i + 1,
          name: squadPlayer.name,
          role: pos.role as any,
          speedStats: speedMult,
          passStats: passMult,
          shootStats: shootMult,
          defStats: defMult,
          creativity: passMult * (0.8 + Math.random() * 0.4),
          runTimer: Math.random() * 1000,
        };
      });
    };

    setPlayers({
      home: initTeam(homeTeam, true),
      away: initTeam(awayTeam, false)
    });
  }, [homeTeam, awayTeam]);

  // Goal Check
  const checkGoal = useCallback((bx: number, by: number) => {
    const inGoalY = by > PITCH_HEIGHT / 2 - GOAL_WIDTH / 2 && by < PITCH_HEIGHT / 2 + GOAL_WIDTH / 2;
    if (bx <= 3 && inGoalY) return 'away';
    if (bx >= PITCH_WIDTH - 3 && inGoalY) return 'home';
    return null;
  }, []);

  const resetPositions = useCallback(() => {
    setBall({ x: PITCH_WIDTH / 2, y: PITCH_HEIGHT / 2, vx: 0, vy: 0, targetPlayer: null, isShot: false });
    setPossession({ team: null, playerId: null });
    possessionStartRef.current = 0;
    previousPossessorRef.current = null;
    pickupCooldownRef.current = {};
    setPlayers(prev => ({
      home: prev.home.map(p => ({ ...p, x: p.baseX, y: p.baseY, vx: 0, vy: 0 })),
      away: prev.away.map(p => ({ ...p, x: p.baseX, y: p.baseY, vx: 0, vy: 0 }))
    }));
    setIsGoalScored(false);
  }, []);

  // AI & Physics Helpers
  const findBestPassTarget = useCallback((passer: PhysicsPlayer, teammates: PhysicsPlayer[], opponents: PhysicsPlayer[], isHome: boolean) => {
    const attackDir = isHome ? 1 : -1;
    const oppGoalX = isHome ? PITCH_WIDTH : 0;
    
    let bestTarget: PhysicsPlayer | null = null;
    let bestScore = -Infinity;
    
    teammates.forEach(t => {
      if (t.id === passer.id) return;
      
      const dist = distance(passer.x, passer.y, t.x, t.y);
      if (dist < 40 || dist > 350) return; // Range check
      
      const angle = Math.atan2(t.y - passer.y, t.x - passer.x);
      let blocked = false;
      
      // Check passing lanes
      opponents.forEach(opp => {
        if (opp.role === 'GK') return;
        const oppDist = distance(passer.x, passer.y, opp.x, opp.y);
        if (oppDist < dist - 15) {
          const oppAngle = Math.atan2(opp.y - passer.y, opp.x - passer.x);
          if (Math.abs(oppAngle - angle) < 0.28) blocked = true;
        }
      });
      
      if (blocked) return;
      
      // Scoring the pass target
      let score = 80;
      const forward = (t.x - passer.x) * attackDir;
      score += forward * 0.8;
      
      const distToGoal = Math.abs(t.x - oppGoalX);
      if (distToGoal < 200 && Math.abs(t.y - PITCH_HEIGHT / 2) < 120) {
        score += 60; // Into danger zone
      }
      
      if (t.role === 'FWD') score += 25;
      if (dist < 140) score += 20; // Short passes preferred
      score += Math.random() * 25; // Randomness
      
      if (score > bestScore) {
        bestScore = score;
        bestTarget = t;
      }
    });
    
    return bestTarget;
  }, []);

  const executePass = useCallback((passer: PhysicsPlayer, target: PhysicsPlayer, currentBall: any, teamKey: string) => {
    const dist = distance(passer.x, passer.y, target.x, target.y);
    const angle = Math.atan2(target.y - passer.y, target.x - passer.x);
    const speed = clamp(dist / 30, 4, PASS_SPEED + (passer.passStats * 2));
    
    currentBall.vx = Math.cos(angle) * speed;
    currentBall.vy = Math.sin(angle) * speed;
    currentBall.targetPlayer = { team: target.team, id: target.id };
    currentBall.isShot = false;
    
    // Notify Match Engine
    // onMatchUpdate(0, 0, 0, { type: 'COMMENTARY', description: `${passer.name} plays it to ${target.name}`, minute: 0, team: teamKey === 'home' ? 'HOME' : 'AWAY' });
    
    return true;
  }, []);

  // Main Game Loop
  const updateGame = useCallback(() => {
    if (isGoalScored) return;

    const now = Date.now();
    
    // Local state copies
    let currentBall = { ...ball };
    let currentPlayers = {
      home: players.home.map(p => ({ ...p })),
      away: players.away.map(p => ({ ...p }))
    };
    let currentPossession = { ...possession };
    
    const allPlayers = [...currentPlayers.home, ...currentPlayers.away];
    
    const possessor = currentPossession.team 
      ? currentPlayers[currentPossession.team].find(p => p.id === currentPossession.playerId)
      : null;

    const possessionDuration = possessor ? now - possessionStartRef.current : 0;

    // --- BALL PHYSICS ---
    if (possessor) {
      const dir = possessor.team === 'home' ? 1 : -1;
      currentBall.x = possessor.x + dir * DRIBBLE_OFFSET;
      currentBall.y = possessor.y;
      currentBall.vx = 0;
      currentBall.vy = 0;
      currentBall.targetPlayer = null;
      currentBall.isShot = false;
    } else {
      currentBall.x += currentBall.vx * gameSpeed;
      currentBall.y += currentBall.vy * gameSpeed;
      currentBall.vx *= BALL_FRICTION;
      currentBall.vy *= BALL_FRICTION;
      
      // Wall Bounces
      if (currentBall.y <= BALL_RADIUS || currentBall.y >= PITCH_HEIGHT - BALL_RADIUS) {
        currentBall.vy *= -0.5;
        currentBall.y = clamp(currentBall.y, BALL_RADIUS, PITCH_HEIGHT - BALL_RADIUS);
      }
      
      const inGoalY = currentBall.y > PITCH_HEIGHT / 2 - GOAL_WIDTH / 2 && 
                      currentBall.y < PITCH_HEIGHT / 2 + GOAL_WIDTH / 2;
      
      if (currentBall.x <= BALL_RADIUS && !inGoalY) {
        currentBall.vx = Math.abs(currentBall.vx) * 0.3;
        currentBall.x = BALL_RADIUS;
      }
      if (currentBall.x >= PITCH_WIDTH - BALL_RADIUS && !inGoalY) {
        currentBall.vx = -Math.abs(currentBall.vx) * 0.3;
        currentBall.x = PITCH_WIDTH - BALL_RADIUS;
      }
      
      // GOAL CHECK
      const goal = checkGoal(currentBall.x, currentBall.y);
      if (goal) {
        setIsGoalScored(true);
        const newScore = { ...score, [goal]: score[goal as 'home' | 'away'] + 1 };
        setScore(newScore);
        
        onMatchUpdate(time, newScore.home, newScore.away, {
          minute: Math.floor(time),
          type: 'GOAL',
          description: `GOAL! ${goal === 'home' ? homeTeam.name : awayTeam.name} score!`,
          team: goal === 'home' ? 'HOME' : 'AWAY'
        });

        setTimeout(() => {
          resetPositions();
        }, 3000);
        return; // Stop update for this frame
      }
      
      // Ball Pickup Logic
      const ballSpeed = Math.sqrt(currentBall.vx ** 2 + currentBall.vy ** 2);
      
      // GK Saves
      if (currentBall.isShot && ballSpeed > 2) {
        const homeGK = currentPlayers.home[0];
        const awayGK = currentPlayers.away[0];
        [homeGK, awayGK].forEach(gk => {
          if (distance(currentBall.x, currentBall.y, gk.x, gk.y) < 35) {
            currentPossession = { team: gk.team, playerId: gk.id };
            currentBall.isShot = false;
            currentBall.targetPlayer = null;
            possessionStartRef.current = now;
            previousPossessorRef.current = null;
            onMatchUpdate(time, score.home, score.away, { minute: Math.floor(time), type: 'CHANCE', description: 'Great save by the keeper!', team: gk.team === 'home' ? 'HOME' : 'AWAY' });
          }
        });
      }

      if (ballSpeed < 8 && !currentPossession.team) {
         let bestReceiver: PhysicsPlayer | null = null;
         let bestDist = CONTROL_DISTANCE;

         allPlayers.forEach(p => {
            const d = distance(currentBall.x, currentBall.y, p.x, p.y);
            const key = `${p.team}-${p.id}`;
            const cooldown = pickupCooldownRef.current[key] || 0;
            
            if (now < cooldown) return;
            if (previousPossessorRef.current?.team === p.team && previousPossessorRef.current?.id === p.id && ballSpeed > 2) return;

            if (d < bestDist) {
              bestDist = d;
              bestReceiver = p;
            }
         });

         if (bestReceiver) {
           const p = bestReceiver as PhysicsPlayer; // TS Fix
           currentPossession = { team: p.team, playerId: p.id };
           currentBall.targetPlayer = null;
           possessionStartRef.current = now;
           
           if (previousPossessorRef.current && previousPossessorRef.current.team !== p.team) {
              const prevKey = `${previousPossessorRef.current.team}-${previousPossessorRef.current.id}`;
              pickupCooldownRef.current[prevKey] = now + 1000; // Cooldown on lost ball
           }
           previousPossessorRef.current = null;
         }
      }
    }

    // --- PLAYER MOVEMENT & LOGIC ---
    const homeHasBall = currentPossession.team === 'home';
    const awayHasBall = currentPossession.team === 'away';
    
    // Team Shift logic (Lines move up/down)
    const homePush = homeHasBall ? 150 : (awayHasBall ? -40 : 0);
    const awayPush = awayHasBall ? -150 : (homeHasBall ? 40 : 0);

    ['home', 'away'].forEach(teamKey => {
      const isHome = teamKey === 'home';
      const teammates = currentPlayers[teamKey as 'home' | 'away'];
      const opponents = currentPlayers[isHome ? 'away' : 'home'];
      const attackDir = isHome ? 1 : -1;
      const oppGoalX = isHome ? PITCH_WIDTH : 0;
      const ownGoalX = isHome ? 0 : PITCH_WIDTH;
      const push = isHome ? homePush : awayPush;
      const weHaveBall = currentPossession.team === teamKey;
      const theyHaveBall = currentPossession.team !== null && currentPossession.team !== teamKey;

      teammates.forEach(player => {
        const hasBall = currentPossession.team === teamKey && currentPossession.playerId === player.id;
        
        // Apply Hidden Impact
        const impact = hiddenImpacts.find(i => i.playerId === player.id);
        const perfMod = impact ? impact.performanceMod : 0;
        
        player.runTimer += 16 * gameSpeed;
        const movePhase = (player.runTimer / 1500) % (Math.PI * 2);
        
        let targetX = player.baseX + push * (0.3 + player.line * 0.25);
        let targetY = player.baseY;
        let shouldSprint = false;

        // --- ROLE LOGIC ---
        if (player.role === 'GK') {
          if (hasBall) {
             // GK Distribution
             if (possessionDuration > 1000 && Math.random() < 0.05) {
                const target = teammates.find(t => t.role !== 'GK' && t.line <= 2);
                if (target) {
                  previousPossessorRef.current = { team: player.team, id: player.id };
                  currentPossession = { team: null, playerId: null };
                  executePass(player, target, currentBall, teamKey);
                }
             }
          } else {
             // GK Positioning
             targetY = PITCH_HEIGHT/2 + (currentBall.y - PITCH_HEIGHT/2) * 0.5;
             targetX = ownGoalX + attackDir * 20;
          }
        } 
        else if (hasBall) {
          // --- PLAYER WITH BALL ---
          const distToGoal = Math.abs(player.x - oppGoalX);
          const inRange = distToGoal < 200;
          
          // Dribble
          targetX = player.x + attackDir * 40;
          
          // Shoot
          if (inRange && Math.random() < 0.05 + (player.shootStats * 0.05)) {
             const goalY = PITCH_HEIGHT/2 + (Math.random() - 0.5) * GOAL_WIDTH * 0.8;
             const angle = Math.atan2(goalY - player.y, oppGoalX - player.x);
             const power = SHOT_POWER * (0.9 + player.shootStats * 0.3);
             
             currentBall.vx = Math.cos(angle) * power;
             currentBall.vy = Math.sin(angle) * power;
             currentBall.isShot = true;
             currentBall.targetPlayer = null;
             
             previousPossessorRef.current = { team: player.team, id: player.id };
             currentPossession = { team: null, playerId: null };
             onMatchUpdate(time, score.home, score.away, { minute: Math.floor(time), type: 'CHANCE', description: `${player.name} shoots!`, team: isHome ? 'HOME' : 'AWAY' });
             return;
          }
          
          // Pass
          if (Math.random() < 0.05 + (player.passStats * 0.05)) {
             const target = findBestPassTarget(player, teammates, opponents, isHome);
             if (target) {
                previousPossessorRef.current = { team: player.team, id: player.id };
                currentPossession = { team: null, playerId: null };
                executePass(player, target, currentBall, teamKey);
                return;
             }
          }
        } 
        else if (weHaveBall) {
           // --- ATTACKING MOVEMENT ---
           targetX += Math.sin(movePhase) * 20;
           if (player.role === 'FWD') {
              targetX += attackDir * 50;
              shouldSprint = true;
           }
        } 
        else if (theyHaveBall) {
           // --- DEFENDING ---
           targetX -= attackDir * 20;
           targetY = player.baseY + (currentBall.y - PITCH_HEIGHT/2) * 0.3; // Shift towards ball side

           // Pressing
           if (distance(player.x, player.y, currentBall.x, currentBall.y) < 100) {
              targetX = currentBall.x - attackDir * 10;
              targetY = currentBall.y;
              shouldSprint = true;
              
              // Tackle
              if (distance(player.x, player.y, currentBall.x, currentBall.y) < 15 && Math.random() < 0.05 + (player.defStats * 0.05)) {
                 const prevKey = `${currentPossession.team}-${currentPossession.playerId}`;
                 pickupCooldownRef.current[prevKey] = now + 1000;
                 previousPossessorRef.current = { team: currentPossession.team || '', id: currentPossession.playerId || '' };
                 
                 currentPossession = { team: teamKey as 'home' | 'away', playerId: player.id };
                 currentBall.targetPlayer = null;
                 currentBall.isShot = false;
                 possessionStartRef.current = now;
                 onMatchUpdate(time, score.home, score.away, { minute: Math.floor(time), type: 'COMMENTARY', description: `${player.name} wins the ball!`, team: isHome ? 'HOME' : 'AWAY' });
              }
           }
        } else {
           // Loose Ball
           if (distance(player.x, player.y, currentBall.x, currentBall.y) < 150) {
              targetX = currentBall.x;
              targetY = currentBall.y;
              shouldSprint = true;
           }
        }

        // --- PHYSICS UPDATE ---
        const dx = targetX - player.x;
        const dy = targetY - player.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        const maxSpeed = BASE_MAX_SPEED * (1 + (player.speedStats * 0.4) + (perfMod * 0.05)); // Attributes + Hidden Impact
        const actualMax = shouldSprint ? maxSpeed * SPRINT_SPEED_MULTI : maxSpeed;
        
        if (dist > 1) {
          const accel = PLAYER_ACCELERATION;
          player.vx += (dx/dist) * accel;
          player.vy += (dy/dist) * accel;
          
          const speed = Math.sqrt(player.vx**2 + player.vy**2);
          if (speed > actualMax) {
             player.vx = (player.vx/speed) * actualMax;
             player.vy = (player.vy/speed) * actualMax;
          }
        } else {
           player.vx *= 0.8;
           player.vy *= 0.8;
        }

        player.vx *= FRICTION;
        player.vy *= FRICTION;
        player.x = clamp(player.x + player.vx * gameSpeed, PLAYER_RADIUS, PITCH_WIDTH - PLAYER_RADIUS);
        player.y = clamp(player.y + player.vy * gameSpeed, PLAYER_RADIUS, PITCH_HEIGHT - PLAYER_RADIUS);
      });
    });

    setBall(currentBall);
    setPlayers(currentPlayers);
    setPossession(currentPossession);
    
    // Time Update (Throttle slightly to avoid spamming parent)
    const newTime = time + (0.05 * gameSpeed);
    setTime(newTime);
    if (Math.floor(newTime) > Math.floor(time)) {
       onMatchUpdate(newTime, score.home, score.away);
    }
    
  }, [ball, players, possession, time, score, isGoalScored, gameSpeed, homeTeam, awayTeam, checkGoal, executePass, findBestPassTarget, hiddenImpacts, onMatchUpdate]);

  useEffect(() => {
    const loop = () => {
       updateGame();
       requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [updateGame]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1a3d21] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/5">
      <svg viewBox={`0 0 ${PITCH_WIDTH} ${PITCH_HEIGHT}`} className="w-full h-full max-w-full max-h-full" preserveAspectRatio="xMidYMid meet">
         {/* Pitch Patterns */}
         <rect x="0" y="0" width={PITCH_WIDTH} height={PITCH_HEIGHT} fill="#1a3d21" />
         {[...Array(16)].map((_, i) => (
            <rect key={i} x={i * (PITCH_WIDTH / 16)} y="0" width={PITCH_WIDTH / 16} height={PITCH_HEIGHT} 
              fill={i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent'} />
         ))}

         {/* Markings */}
         <path d={`M 2 2 L ${PITCH_WIDTH-2} 2 L ${PITCH_WIDTH-2} ${PITCH_HEIGHT-2} L 2 ${PITCH_HEIGHT-2} Z`} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
         <line x1={PITCH_WIDTH / 2} y1="0" x2={PITCH_WIDTH / 2} y2={PITCH_HEIGHT} stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
         <circle cx={PITCH_WIDTH / 2} cy={PITCH_HEIGHT / 2} r="60" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
         
         {/* Boxes */}
         <rect x="0" y={(PITCH_HEIGHT - 160) / 2} width="110" height="160" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
         <rect x={PITCH_WIDTH - 110} y={(PITCH_HEIGHT - 160) / 2} width="110" height="160" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
         
         {/* Goals */}
         <rect x="-8" y={(PITCH_HEIGHT - GOAL_WIDTH) / 2} width="10" height={GOAL_WIDTH} fill="none" stroke="#fff" strokeWidth="4" />
         <rect x={PITCH_WIDTH - 2} y={(PITCH_HEIGHT - GOAL_WIDTH) / 2} width="10" height={GOAL_WIDTH} fill="none" stroke="#fff" strokeWidth="4" />

         {/* Players */}
         {players.home.map(p => {
             const hasBall = possession.team === 'home' && possession.playerId === p.id;
             return (
               <g key={p.id} style={{ transition: 'all 0.1s linear' }}>
                  {hasBall && <circle cx={p.x} cy={p.y} r={PLAYER_RADIUS + 4} fill="none" stroke="yellow" strokeWidth="2" opacity="0.7" />}
                  <circle cx={p.x} cy={p.y} r={PLAYER_RADIUS} fill={homeTeam.primaryColor} stroke="#fff" strokeWidth="2" />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">{p.number}</text>
               </g>
             )
         })}
         {players.away.map(p => {
             const hasBall = possession.team === 'away' && possession.playerId === p.id;
             return (
               <g key={p.id} style={{ transition: 'all 0.1s linear' }}>
                  {hasBall && <circle cx={p.x} cy={p.y} r={PLAYER_RADIUS + 4} fill="none" stroke="yellow" strokeWidth="2" opacity="0.7" />}
                  <circle cx={p.x} cy={p.y} r={PLAYER_RADIUS} fill={awayTeam.primaryColor} stroke="#fff" strokeWidth="2" />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">{p.number}</text>
               </g>
             )
         })}

         {/* Ball */}
         <circle cx={ball.x} cy={ball.y} r={BALL_RADIUS} fill="white" stroke="black" strokeWidth="1" />
      </svg>
      
      {/* Goal Overlay */}
      {isGoalScored && (
         <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in zoom-in">
             <div className="text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(16,185,129,1)]">GOAL!</div>
         </div>
      )}
    </div>
  );
};
