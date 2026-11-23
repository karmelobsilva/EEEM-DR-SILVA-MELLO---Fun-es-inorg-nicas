import React, { useState } from 'react';
import {
  ArrowRight,
  FlaskConical,
  Plus,
  Smartphone,
  Trash2,
  Users,
} from 'lucide-react';
import { FUNCTION_META, TEAM_COLORS } from '../data/chemistryData';
import { ChemFunction } from '../types/game';
import { ChemFormula } from '../utils/formula';
import { soundEngine } from '../utils/sound';

interface HomeSetupProps {
  onStartSolo: (nickname: string) => void;
  onStartTeams: (teamNames: string[]) => void;
}

const DEFAULT_TEAM_NAMES = ['Equipe Alfa', 'Equipe Beta', 'Equipe Gama'];

const SAMPLE_CARDS: { func: ChemFunction; formula: string; name: string }[] = [
  { func: 'acid', formula: 'H2SO4', name: 'Ácido sulfúrico' },
  { func: 'base', formula: 'Mg(OH)2', name: 'Hidróxido de magnésio' },
  { func: 'salt', formula: 'CaCO3', name: 'Carbonato de cálcio' },
  { func: 'oxide', formula: 'Fe2O3', name: 'Óxido de ferro III' },
];

export const HomeSetup: React.FC<HomeSetupProps> = ({ onStartSolo, onStartTeams }) => {
  const [selectedMode, setSelectedMode] = useState<'solo' | 'teams'>('solo');
  const [nickname, setNickname] = useState('');
  const [teamNames, setTeamNames] = useState<string[]>(DEFAULT_TEAM_NAMES);

  const validTeams = teamNames.map((n) => n.trim()).filter(Boolean);
  const canStartTeams = teamNames.length >= 3 && teamNames.length <= 8 && validTeams.length >= 3;

  const handleAddTeam = () => {
    if (teamNames.length >= 8) return;
    soundEngine.playClick();
    const nextNum = teamNames.length + 1;
    setTeamNames([...teamNames, `Equipe ${nextNum}`]);
  };

  const handleRemoveTeam = (index: number) => {
    soundEngine.playClick();
    setTeamNames(teamNames.filter((_, idx) => idx !== index));
  };

  const handleUpdateTeamName = (index: number, value: string) => {
    const updated = [...teamNames];
    updated[index] = value;
    setTeamNames(updated);
  };

  const handleSoloSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    onStartSolo(nickname.trim() || 'Estudante');
  };

  const handleTeamsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canStartTeams) return;
    soundEngine.playClick();
    onStartTeams(validTeams);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Hero & Pedagogical Overview */}
        <section className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-500">
              Química Inorgânica · 4 fases interativas
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1] text-balance">
              Domine as Funções Inorgânicas na prática
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Classifique fórmulas no radar rápido, conecte nomenclaturas oficiais, investigue o pH no laboratório com repolho roxo e complete reações de neutralização.
            </p>
          </div>

          {/* 4 Chemical Functions Visual Legend */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
            {SAMPLE_CARDS.map((item) => {
              const meta = FUNCTION_META[item.func];
              return (
                <div
                  key={item.func}
                  className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between gap-2 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-bold tracking-wide"
                      style={{ color: meta.color }}
                    >
                      {meta.plural}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: meta.color }}
                    />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    <ChemFormula formula={item.formula} />
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    {meta.signature}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Phases Overview (Clean Editorial List) */}
          <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
            <div>
              <span className="font-display font-bold text-slate-900 block">01. Radar</span>
              Triagem rápida com combo
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 block">02. Conexão</span>
              Fórmula e nome oficial
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 block">03. Lab de pH</span>
              Indicador de repolho roxo
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 block">04. Reações</span>
              Sal + água na neutralização
            </div>
          </div>
        </section>

        {/* Right Mode Configuration Card */}
        <section className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Escolha o modo de jogo
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Jogue individualmente no celular ou em grupos na lousa digital.
              </p>
            </div>

            {/* Mode Segmented Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedMode('solo');
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  selectedMode === 'solo'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>Modo Solo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedMode('teams');
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  selectedMode === 'teams'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Modo Equipes</span>
              </button>
            </div>

            {/* Mode 1: Solo Form */}
            {selectedMode === 'solo' ? (
              <form onSubmit={handleSoloSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="solo-nickname"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Apelido (opcional)
                  </label>
                  <input
                    id="solo-nickname"
                    type="text"
                    maxLength={28}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Ex: Maria, Dalton, QuímicaPro..."
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-sm text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-blue-600" />
                    Como funciona o Modo Solo
                  </p>
                  <p>
                    Avance pelas 4 fases em sequência, acumule pontos por precisão e rapidez e receba um diagnóstico detalhado do que você domina ou precisa revisar.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-blue-600 active:scale-[0.99] text-white font-display font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span>Iniciar Modo Solo</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            ) : (
              /* Mode 2: Teams Form */
              <form onSubmit={handleTeamsSubmit} className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Equipes participantes ({teamNames.length}/8)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cadastre de 3 a 8 grupos. Cada equipe joga sua vez em cada fase.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTeam}
                    disabled={teamNames.length >= 8}
                    className="h-10 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {teamNames.map((name, idx) => {
                    const color = TEAM_COLORS[idx % TEAM_COLORS.length];
                    return (
                      <div key={idx} className="flex items-center gap-2.5">
                        <span
                          className="w-8 h-11 rounded-xl flex items-center justify-center text-white font-mono font-bold text-sm shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          maxLength={26}
                          value={name}
                          onChange={(e) => handleUpdateTeamName(idx, e.target.value)}
                          placeholder={`Nome da Equipe ${idx + 1}`}
                          aria-label={`Nome da equipe ${idx + 1}`}
                          className="flex-1 h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTeam(idx)}
                          aria-label={`Remover equipe ${idx + 1}`}
                          className="w-11 h-11 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {!canStartTeams && (
                  <p className="text-xs font-medium text-rose-600">
                    Cadastre e nomeie pelo menos 3 grupos para ativar o início da partida.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canStartTeams}
                  className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed active:scale-[0.99] text-white font-display font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span>Iniciar Jogo</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
