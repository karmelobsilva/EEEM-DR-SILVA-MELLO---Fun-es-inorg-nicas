import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Trophy,
  Users,
} from 'lucide-react';
import { PHASE_META, TEAM_COLORS } from '../data/chemistryData';
import { GameMode, PhaseId, PlayerOrTeam } from '../types/game';
import { soundEngine } from '../utils/sound';

interface ResultsScreenProps {
  mode: GameMode;
  players: PlayerOrTeam[];
  onPlayAgainSolo: () => void;
  onReplaySameTeams: () => void;
  onRegisterNewTeams: () => void;
}

const PHASE_IDS: PhaseId[] = [1, 2, 3, 4];

const PHASE_STUDY_TIPS: Record<PhaseId, string> = {
  1: 'Observe sempre o início e o fim da fórmula: H⁺ indica ácido, OH⁻ indica base, 2 elementos com O indica óxido, e cátion + ânion distintos formam sal.',
  2: 'Revise as terminações da nomenclatura: -ídrico/-ico para ácidos, "Hidróxido de..." para bases e -eto/-ato/-ito para sais.',
  3: 'Lembre-se da régua: pH < 7 é ácido (quanto menor, mais forte), pH = 7 é neutro, e pH > 7 é básico (quanto maior, mais forte).',
  4: 'Na neutralização, H⁺ do ácido junta-se com OH⁻ da base para formar água (H₂O), enquanto o cátion e o ânion restantes formam o sal.',
};

function calcAccuracy(correct: number, answered: number): number {
  if (answered === 0) return 0;
  return Math.round((correct / answered) * 1000) / 10;
}

function formatPct(pct: number): string {
  return Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(1).replace('.', ',')}%`;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  mode,
  players,
  onPlayAgainSolo,
  onReplaySameTeams,
  onRegisterNewTeams,
}) => {
  useEffect(() => {
    soundEngine.playVictory();
  }, []);

  if (mode === 'solo') {
    const player = players[0];
    const overallPct = calcAccuracy(player.totalCorrect, player.totalAnswered);

    const phaseBreakdown = PHASE_IDS.map((pid) => {
      const st = player.phaseStats[pid];
      const pct = calcAccuracy(st.correct, st.answered);
      return {
        phaseId: pid,
        title: PHASE_META[pid].shortTitle,
        ...st,
        pct,
      };
    });

    const sortedByPct = [...phaseBreakdown].sort((a, b) => b.pct - a.pct);
    const bestPhase = sortedByPct[0];
    const weakestPhase = sortedByPct[sortedByPct.length - 1];

    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Hero Summary */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm text-center space-y-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <Trophy className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-500">
              Missão concluída · {player.name}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
              Resultado do Laboratório
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto pt-2">
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
              <span className="text-xs font-medium text-slate-500 block">
                Pontuação Total
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                {player.totalScore}
              </span>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
              <span className="text-xs font-medium text-slate-500 block">
                Aproveitamento
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-emerald-600 tabular-nums">
                {formatPct(overallPct)}
              </span>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
              <span className="text-xs font-medium text-slate-500 block">
                Acertos
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                {player.totalCorrect}/{player.totalAnswered}
              </span>
            </div>
          </div>
        </motion.section>

        {/* Performance by Phase */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phaseBreakdown.map((item) => {
            const isBest = item.phaseId === bestPhase.phaseId && item.pct >= 60;
            const needsReview = item.phaseId === weakestPhase.phaseId && item.pct < 85;
            return (
              <div
                key={item.phaseId}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-400">
                      Fase 0{item.phaseId}
                    </span>
                    <h2 className="font-display font-bold text-lg text-slate-900">
                      {item.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-lg text-slate-900 tabular-nums block">
                      {formatPct(item.pct)}
                    </span>
                    <span className="text-xs text-slate-500 tabular-nums">
                      {item.score} pts · {item.correct}/{item.answered}
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.pct >= 75
                        ? 'bg-emerald-500'
                        : item.pct >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>

                <div className="text-xs font-medium flex items-center gap-1.5">
                  {isBest ? (
                    <span className="text-emerald-700 flex items-center gap-1.5">
                      <Award className="w-4 h-4 shrink-0" />
                      Melhor desempenho nesta partida
                    </span>
                  ) : needsReview ? (
                    <span className="text-amber-700 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 shrink-0" />
                      Ponto de revisão recomendado
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Desempenho consistente
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* Actionable Study Tip */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-slate-900">
              {weakestPhase.pct >= 85
                ? 'Domínio excelente em todas as fases!'
                : `Dica para revisar: ${weakestPhase.title}`}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              {weakestPhase.pct >= 85
                ? 'Você manteve alto aproveitamento em classificação, nomenclatura, pH e reações. Jogue novamente para superar seu recorde de rapidez.'
                : PHASE_STUDY_TIPS[weakestPhase.phaseId]}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onPlayAgainSolo();
            }}
            className="h-12 px-6 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-display font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jogar Novamente</span>
          </button>
        </section>
      </main>
    );
  }

  // Team Mode Podium & Full Ranking
  const rankedTeams = [...players].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    const accA = calcAccuracy(a.totalCorrect, a.totalAnswered);
    const accB = calcAccuracy(b.totalCorrect, b.totalAnswered);
    return accB - accA;
  });

  const top3 = rankedTeams.slice(0, 3);
  const podiumOrder =
    top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-sm font-semibold text-slate-500">
          Resultado Final · Modo Equipes
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
          Pódio e Classificação Geral
        </h1>
      </div>

      {/* Top 3 Visual Podium */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        {podiumOrder.map((team) => {
          const rank = rankedTeams.findIndex((t) => t.id === team.id) + 1;
          const color = TEAM_COLORS[team.colorIndex % TEAM_COLORS.length];
          const pct = calcAccuracy(team.totalCorrect, team.totalAnswered);
          const isFirst = rank === 1;

          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: rank * 0.06 }}
              className={`bg-white rounded-3xl border p-6 text-center space-y-3 shadow-sm ${
                isFirst
                  ? 'border-amber-300 ring-2 ring-amber-200/70 sm:order-2 sm:py-8'
                  : rank === 2
                    ? 'border-slate-200 sm:order-1'
                    : 'border-slate-200 sm:order-3'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span
                  className="w-10 h-10 rounded-xl text-white font-display font-extrabold text-lg flex items-center justify-center"
                  style={{ backgroundColor: isFirst ? '#F59E0B' : color }}
                >
                  {rank}º
                </span>
              </div>

              <div className="space-y-0.5">
                <h2 className="font-display font-bold text-xl text-slate-900 truncate">
                  {team.name}
                </h2>
                <p className="text-xs font-medium text-slate-500">
                  {isFirst ? 'Equipe campeã' : `${rank}º lugar geral`}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-5">
                <div>
                  <span className="text-[11px] text-slate-400 block">Pontos</span>
                  <span className="font-mono font-bold text-2xl text-slate-900 tabular-nums">
                    {team.totalScore}
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Aproveitamento</span>
                  <span className="font-mono font-bold text-xl text-emerald-600 tabular-nums">
                    {formatPct(pct)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Complete Ranking Table */}
      <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-slate-900">
            Ranking Completo ({rankedTeams.length} equipes)
          </h3>
          <span className="text-xs text-slate-500">
            Ordenado por pontuação e aproveitamento
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 bg-slate-50/70">
                <th className="py-3 px-6">Posição</th>
                <th className="py-3 px-4">Nome do Grupo</th>
                <th className="py-3 px-4 text-right">Acertos</th>
                <th className="py-3 px-4 text-right">Aproveitamento (%)</th>
                <th className="py-3 px-6 text-right">Pontuação Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rankedTeams.map((team, idx) => {
                const color = TEAM_COLORS[team.colorIndex % TEAM_COLORS.length];
                const pct = calcAccuracy(team.totalCorrect, team.totalAnswered);

                return (
                  <tr key={team.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900 tabular-nums">
                      {idx + 1}º
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-semibold text-slate-900">
                          {team.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 tabular-nums">
                      {team.totalCorrect}/{team.totalAnswered}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                      {formatPct(pct)}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {team.totalScore}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onReplaySameTeams();
          }}
          className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-display font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reiniciar com Mesmas Equipes</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onRegisterNewTeams();
          }}
          className="w-full sm:w-auto h-12 px-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-display font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
        >
          <Users className="w-4 h-4" />
          <span>Cadastrar Novas Equipes</span>
        </button>
      </div>
    </main>
  );
};
