import React from 'react';
import { motion } from 'motion/react';
import { Play, Users } from 'lucide-react';
import { PHASE_META, TEAM_COLORS } from '../data/chemistryData';
import { PhaseId, PlayerOrTeam } from '../types/game';
import { soundEngine } from '../utils/sound';

interface TurnBannerProps {
  phase: PhaseId;
  team: PlayerOrTeam;
  teamNumber: number;
  totalTeams: number;
  onReady: () => void;
}

export const TurnBanner: React.FC<TurnBannerProps> = ({
  phase,
  team,
  teamNumber,
  totalTeams,
  onReady,
}) => {
  const phaseInfo = PHASE_META[phase];
  const teamColor = TEAM_COLORS[team.colorIndex % TEAM_COLORS.length];

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="h-2.5 w-full" style={{ backgroundColor: teamColor }} />

        <div className="p-6 sm:p-10 text-center space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-500">
              {phaseInfo.title} · Turno {teamNumber} de {totalTeams}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
              Vez da equipe:{' '}
              <span style={{ color: teamColor }}>{team.name}</span>
            </h1>
          </div>

          <div className="max-w-lg mx-auto rounded-2xl bg-slate-50 border border-slate-200/80 p-5 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Users className="w-4 h-4" />
              <span>Desafio desta fase</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-800">
              {phaseInfo.subtitle}
            </p>
            <p className="text-xs text-slate-500">
              O cronômetro de rapidez começa assim que vocês clicarem abaixo.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onReady();
              }}
              className="w-full sm:w-auto min-w-[260px] h-14 px-8 rounded-2xl bg-slate-900 hover:bg-blue-600 active:scale-[0.99] text-white font-display font-bold text-lg inline-flex items-center justify-center gap-2.5 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Estou pronto</span>
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
