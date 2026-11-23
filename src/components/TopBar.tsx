import React from 'react';
import { FlaskConical, Home, Volume2, VolumeX } from 'lucide-react';
import { GameMode, PhaseId, PlayerOrTeam } from '../types/game';
import { PHASE_META, TEAM_COLORS } from '../data/chemistryData';

interface TopBarProps {
  screen: 'home' | 'turn_banner' | 'playing' | 'results';
  mode: GameMode;
  currentPhase: PhaseId;
  players: PlayerOrTeam[];
  activePlayerIndex: number;
  muted: boolean;
  onToggleMute: () => void;
  onGoHome: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  screen,
  mode,
  currentPhase,
  players,
  activePlayerIndex,
  muted,
  onToggleMute,
  onGoHome,
}) => {
  const activePlayer = players[activePlayerIndex];
  const progressPercent =
    screen === 'results'
      ? 100
      : screen === 'home'
        ? 0
        : ((currentPhase - 1) / 4) * 100 + (screen === 'playing' ? 12.5 : 0);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-1 -ml-1"
          title="Voltar para a tela inicial"
        >
          <span className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
            <FlaskConical className="w-5 h-5" />
          </span>
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-900 whitespace-nowrap">
            Inorgânica Lab
          </span>
        </button>

        {/* Center Context during active play */}
        {screen !== 'home' && screen !== 'results' && (
          <div className="hidden md:flex items-center gap-3 text-sm text-slate-600 min-w-0">
            <span className="font-semibold text-slate-900 whitespace-nowrap">
              {PHASE_META[currentPhase].shortTitle}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="tabular-nums whitespace-nowrap">Fase {currentPhase} de 4</span>
            {activePlayer && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-medium text-slate-800 truncate max-w-[180px]">
                  {activePlayer.name}
                </span>
              </>
            )}
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {screen !== 'home' && activePlayer && mode === 'solo' && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm">
              <span className="text-slate-500">Pontos:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {activePlayer.totalScore}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Ativar som' : 'Silenciar som'}
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {screen !== 'home' && (
            <button
              type="button"
              onClick={onGoHome}
              className="h-10 px-3 sm:px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Progress Bar */}
      {screen !== 'home' && (
        <div className="w-full h-1 bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Discreet Live Scoreboard Strip in Team Mode during turn transitions & rounds */}
      {mode === 'teams' && (screen === 'turn_banner' || screen === 'playing') && players.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1.5 flex items-center gap-4 overflow-x-auto text-xs">
            <span className="font-semibold text-slate-500 shrink-0">Placar ao vivo:</span>
            <div className="flex items-center gap-4">
              {players.map((team, idx) => {
                const isTurn = idx === activePlayerIndex;
                const color = TEAM_COLORS[team.colorIndex % TEAM_COLORS.length];
                return (
                  <div
                    key={team.id}
                    className={`flex items-center gap-1.5 shrink-0 transition-opacity ${
                      isTurn ? 'text-slate-900 font-bold' : 'text-slate-600'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="truncate max-w-[110px]">{team.name}</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {team.totalScore}
                    </span>
                    {idx < players.length - 1 && (
                      <span aria-hidden="true" className="text-slate-300 ml-2">·</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
