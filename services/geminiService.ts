
import { GoogleGenAI, Type } from "@google/genai";
import { Player, Team, MatchStats, HiddenImpact } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTeamTalk = async (managerSpeech: string, squad: Player[], teamName: string) => {
  const squadInfo = squad.map(p => `${p.name} (${p.position}, Rating: ${p.rating}, Traits: ${p.traits.join(',')})`).join('\n');
  
  const prompt = `You are a group of professional football players for ${teamName}. 
  The manager just gave a pre-match speech: "${managerSpeech}"
  
  Evaluate how this speech affects the squad below. Some might be inspired, some might be pressured.
  Squad:
  ${squadInfo}
  
  Return a JSON object with an array of impacts for each player ID.
  Hidden from the user, the 'performanceMod' will affect the actual match simulation.
  The 'generalReaction' is a summary of the room's atmosphere to show the user.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          generalReaction: { type: Type.STRING, description: "A few sentences describing the room's vibe." },
          impacts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                playerId: { type: Type.STRING },
                performanceMod: { type: Type.NUMBER, description: "Hidden multiplier for player performance (-5 to +5)" },
                moraleImpact: { type: Type.STRING, description: "Short description: e.g., 'Inspired', 'Anxious', 'Bored'" }
              }
            }
          }
        },
        required: ["generalReaction", "impacts"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateMatchCommentary = async (stats: MatchStats, homeTeam: Team, awayTeam: Team, shout?: string, hiddenImpacts?: HiddenImpact[]) => {
  const impactSummary = hiddenImpacts?.map(i => {
    const p = homeTeam.squad.find(ps => ps.id === i.playerId);
    return `${p?.name} is ${i.moraleImpact} (mod: ${i.performanceMod})`;
  }).join(', ');

  const prompt = `You are a world-class football commentator for a Premier League match.
  Match: ${homeTeam.name} (${stats.homeScore}) vs ${awayTeam.name} (${stats.awayScore}). 
  Minute: ${stats.minute}. 
  Manager's active shout: "${shout || 'Quiet on the sideline'}".
  Squad Mental State (Hidden Context): ${impactSummary || 'Normal'}.
  
  Generate a vivid, very short commentary (max 2 sentences). 
  Focus on the action. If a manager's shout is active, mention its effect.
  Calculate probabilities for goals based on team strength and current mental state.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          commentary: { type: Type.STRING },
          homeGoalProb: { type: Type.NUMBER, description: "0-100 probability" },
          awayGoalProb: { type: Type.NUMBER, description: "0-100 probability" },
          events: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 type: { type: Type.STRING, enum: ["GOAL", "CHANCE", "COMMENTARY"] },
                 description: { type: Type.STRING },
                 team: { type: Type.STRING, enum: ["HOME", "AWAY"] }
               }
             }
          }
        },
        required: ["commentary", "homeGoalProb", "awayGoalProb"]
      }
    }
  });

  return JSON.parse(response.text);
};
