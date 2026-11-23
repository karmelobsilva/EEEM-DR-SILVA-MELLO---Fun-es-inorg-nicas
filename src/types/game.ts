export type GameMode = 'solo' | 'teams';

export type PhaseId = 1 | 2 | 3 | 4;

export type ChemFunction = 'acid' | 'base' | 'salt' | 'oxide';

export type PhZoneId = 'strong_acid' | 'weak_acid' | 'neutral' | 'weak_base' | 'strong_base';

export interface CompoundItem {
  id: string;
  formula: string;
  name: string;
  func: ChemFunction;
  hint: string;
  explanation: string;
  hasAmmonium?: boolean;
  isPeroxideOrSuperoxide?: boolean;
}

export interface PhItem {
  id: string;
  commonName: string;
  formula: string;
  exactPh: number;
  zone: PhZoneId;
  explanation: string;
}

export interface NeutralizationItem {
  id: string;
  leftParts: [string, string]; // e.g., ['HCl', 'NaOH'] (one may be '?')
  rightParts: [string, string]; // e.g., ['?', 'H2O']
  missingPosition: 'acid' | 'base' | 'salt';
  correctAnswer: string;
  options: string[];
  explanation: string;
  fullEquation: string;
}

export interface PhaseStats {
  answered: number;
  correct: number;
  score: number;
}

export interface PlayerOrTeam {
  id: string;
  name: string;
  colorIndex: number;
  totalScore: number;
  totalAnswered: number;
  totalCorrect: number;
  phaseStats: Record<PhaseId, PhaseStats>;
}

export interface TurnResult {
  scoreDelta: number;
  answeredDelta: number;
  correctDelta: number;
}
