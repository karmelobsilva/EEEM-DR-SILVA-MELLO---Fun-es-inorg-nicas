import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Droplets,
  FlaskConical,
  Play,
  Timer,
  X,
  XCircle,
} from 'lucide-react';
import {
  PH_BANK,
  PH_ZONES,
  PHASE_META,
  shuffleArray,
} from '../data/chemistryData';
import { PhItem, PhZoneId, TurnResult } from '../types/game';
import { ChemFormula } from '../utils/formula';
import { soundEngine } from '../utils/sound';

interface Phase3PhScaleProps {
  questionCount: number;
  playerName: string;
  onComplete: (result: TurnResult) => void;
}

const PH_TICKS = Array.from({ length: 15 }, (_, i) => i);

const BeakerGraphic: React.FC<{
  liquidColor: string;
  colorName: string;
  dropped: boolean;
}> = ({ liquidColor, colorName, dropped }) => {
  const uid = useId();
  const clipId = `beaker-clip-${uid}`;
  const gradId = `beaker-grad-${uid}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-36 sm:w-36 sm:h-40 flex items-end justify-center">
        {/* Dropper animation */}
        <motion.div
          key={dropped ? 'drop-active' : 'drop-idle'}
          initial={{ y: -8, opacity: 0 }}
          animate={dropped ? { y: [0, 26], opacity: [1, 0] } : { opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeIn' }}
          className="absolute top-1 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <div className="w-3 h-4 rounded-full bg-purple-600 shadow-xs" />
        </motion.div>

        {/* SVG Laboratory Beaker */}
        <svg
          viewBox="0 0 120 130"
          className="w-full h-full drop-shadow-xs"
          aria-label={`Béquer com solução na cor ${colorName}`}
        >
          <defs>
            <clipPath id={clipId}>
              <path d="M 24 22 L 24 104 Q 24 116 36 116 L 84 116 Q 96 116 96 104 L 96 22 Z" />
            </clipPath>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={liquidColor} stopOpacity="0.82" />
              <stop offset="100%" stopColor={liquidColor} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Glass interior background */}
          <path
            d="M 24 22 L 24 104 Q 24 116 36 116 L 84 116 Q 96 116 96 104 L 96 22 Z"
            fill="#F8FAFC"
          />

          {/* Colored liquid */}
          <g clipPath={`url(#${clipId})`}>
            <rect
              x="20"
              y={dropped ? 50 : 56}
              width="80"
              height="70"
              fill={dropped ? `url(#${gradId})` : '#E2E8F0'}
              className="transition-all duration-500"
            />
            {/* Liquid meniscus highlight */}
            <ellipse
              cx="60"
              cy={dropped ? 50 : 56}
              rx="36"
              ry="3.5"
              fill="rgba(255,255,255,0.35)"
            />
          </g>

          {/* Graduation marks */}
          <line x1="30" y1="45" x2="40" y2="45" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="30" y1="65" x2="44" y2="65" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="30" y1="85" x2="40" y2="85" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="30" y1="102" x2="44" y2="102" stroke="#94A3B8" strokeWidth="1.5" />

          {/* Glass outline */}
          <path
            d="M 18 18 L 24 22 L 24 104 Q 24 116 36 116 L 84 116 Q 96 116 96 104 L 96 22 L 102 18"
            fill="none"
            stroke="#334155"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-xs font-semibold text-slate-600 text-center">
        {dropped ? colorName : 'Amostra sem indicador'}
      </span>
    </div>
  );
};

export const Phase3PhScale: React.FC<Phase3PhScaleProps> = ({
  questionCount,
  playerName,
  onComplete,
}) => {
  const questions = useMemo<PhItem[]>(
    () => shuffleArray(PH_BANK).slice(0, questionCount),
    [questionCount]
  );

  const [showIntro, setShowIntro] = useState(true);
  const [introSelectedZone, setIntroSelectedZone] = useState<PhZoneId>('neutral');
  const [showGuideModal, setShowGuideModal] = useState(false);

  const [index, setIndex] = useState(0);
  const [indicatorDropped, setIndicatorDropped] = useState(false);
  const [submittedZone, setSubmittedZone] = useState<PhZoneId | null>(null);
  const [earnedPoints, setEarnedPoints] = useState<{
    total: number;
    speed: number;
  } | null>(null);

  const [scoreTotal, setScoreTotal] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const startTimeRef = useRef<number>(Date.now());
  const guideOpenedAtRef = useRef<number | null>(null);

  const currentItem = questions[index];
  const currentZoneObj = PH_ZONES.find((z) => z.id === currentItem.zone) ?? PH_ZONES[2];
  const isAnswered = submittedZone !== null;
  const isCorrect = isAnswered && submittedZone === currentItem.zone;

  useEffect(() => {
    if (showIntro) return;
    startTimeRef.current = Date.now();
    setSubmittedZone(null);
    setEarnedPoints(null);
    setIndicatorDropped(false);

    const dropTimer = window.setTimeout(() => {
      setIndicatorDropped(true);
    }, 180);

    return () => window.clearTimeout(dropTimer);
  }, [index, showIntro]);

  const handleStartActivity = () => {
    soundEngine.playClick();
    setShowIntro(false);
    startTimeRef.current = Date.now();
  };

  const handleOpenGuide = () => {
    soundEngine.playClick();
    guideOpenedAtRef.current = Date.now();
    setShowGuideModal(true);
  };

  const handleCloseGuide = () => {
    soundEngine.playClick();
    if (guideOpenedAtRef.current !== null) {
      startTimeRef.current += Date.now() - guideOpenedAtRef.current;
      guideOpenedAtRef.current = null;
    }
    setShowGuideModal(false);
  };

  const handleSelectCharacter = (zoneId: PhZoneId) => {
    if (isAnswered) return;

    const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
    const speedBonus = Math.max(5, Math.min(50, Math.round(50 - elapsedSec * 3.5)));
    const hit = zoneId === currentItem.zone;

    setSubmittedZone(zoneId);
    setAnsweredCount((prev) => prev + 1);

    if (hit) {
      const total = 100 + speedBonus;
      setScoreTotal((prev) => prev + total);
      setCorrectCount((prev) => prev + 1);
      setEarnedPoints({ total, speed: speedBonus });
      soundEngine.playCorrect(1);
    } else {
      setEarnedPoints(null);
      soundEngine.playWrong();
    }
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (index + 1 >= questions.length) {
      soundEngine.playPhaseComplete();
      onComplete({
        scoreDelta: scoreTotal,
        answeredDelta: answeredCount,
        correctDelta: correctCount,
      });
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  const introZoneObj =
    PH_ZONES.find((z) => z.id === introSelectedZone) ?? PH_ZONES[2];

  // Step 1: Virtual Lab Orientation & Red Cabbage Color Scale
  if (showIntro) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500">
            {PHASE_META[3].title} · {playerName}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Como funciona o Indicador de Repolho Roxo
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Antes de começar, conheça a escala de cores desse indicador natural para interpretar as amostras do laboratório.
          </p>
        </div>

        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Interactive Test Beaker Preview */}
            <div className="md:col-span-5 rounded-2xl bg-slate-50 border border-slate-200/80 p-5 flex flex-col items-center text-center space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                <Droplets className="w-4 h-4" />
                <span>Simulação de cor ao vivo</span>
              </div>

              <BeakerGraphic
                liquidColor={introZoneObj.cabbageHex}
                colorName={introZoneObj.cabbageColorName}
                dropped={true}
              />

              <div className="space-y-1">
                <p className="font-display font-bold text-lg text-slate-900">
                  {introZoneObj.label} ({introZoneObj.rangeLabel})
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {introZoneObj.cabbageNote}
                </p>
              </div>
            </div>

            {/* 5 Color Bands Reference List */}
            <div className="md:col-span-7 space-y-3">
              <p className="text-xs font-bold text-slate-500">
                Toque em cada faixa para testar a cor do repolho roxo:
              </p>

              <div className="space-y-2">
                {PH_ZONES.map((zone) => {
                  const isSelected = introSelectedZone === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setIntroSelectedZone(zone.id);
                      }}
                      className={`w-full px-4 py-3 rounded-2xl border-2 flex items-center justify-between gap-3 text-left transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="w-6 h-6 rounded-lg shrink-0 border border-black/10"
                          style={{ background: zone.cabbageGradient }}
                        />
                        <div className="min-w-0">
                          <span className="font-display font-bold text-sm sm:text-base text-slate-900 block">
                            {zone.label}
                          </span>
                          <span className="text-xs text-slate-500 block truncate">
                            Cor: {zone.cabbageColorName}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 shrink-0 tabular-nums">
                        {zone.rangeLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Activity Instructions */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-sm text-slate-700">
              <p className="font-display font-bold text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" />
                Como funciona a atividade
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Cada produto virá com o <strong>valor de pH medido</strong> e a reação de cor do repolho roxo no béquer. Associe o pH e a cor ao caráter correspondente (Ácido Forte, Ácido Fraco, Neutro, Básico Fraco ou Básico Forte).
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartActivity}
              className="h-12 px-6 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-display font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Iniciar Experimento</span>
            </button>
          </div>
        </section>
      </main>
    );
  }

  // Step 2: Active Virtual Lab Questions
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {PHASE_META[3].title} · {playerName}
          </p>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Observe o pH medido e a cor no béquer para classificar
          </h1>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <button
            type="button"
            onClick={handleOpenGuide}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-purple-50 hover:border-purple-300 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Guia de Cores</span>
          </button>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="font-mono font-bold text-slate-900 tabular-nums">
            {index + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Virtual Lab Bench Card */}
      <motion.section
        key={currentItem.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 ${
          isAnswered && !isCorrect ? 'animate-shake' : ''
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pb-6 border-b border-slate-100">
          {/* Beaker with Red Cabbage Indicator */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
            <BeakerGraphic
              liquidColor={currentZoneObj.cabbageHex}
              colorName={currentZoneObj.cabbageColorName}
              dropped={indicatorDropped}
            />
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setIndicatorDropped(false);
                window.setTimeout(() => setIndicatorDropped(true), 120);
              }}
              className="mt-2 text-xs font-semibold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Pingar extrato novamente</span>
            </button>
          </div>

          {/* Product Details + Explicit Measured pH Readout */}
          <div className="sm:col-span-8 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400">
                Amostra analisada no laboratório
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                {currentItem.commonName}
              </h2>
              <div className="pt-1 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span>
                  Fórmula:{' '}
                  {currentItem.formula === 'Ácidos orgânicos' ? (
                    <strong className="font-mono text-slate-900">Ácidos orgânicos</strong>
                  ) : (
                    <ChemFormula
                      formula={currentItem.formula}
                      className="font-bold text-slate-900 text-base"
                    />
                  )}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>
                  Cor no repolho roxo:{' '}
                  <strong className="text-slate-900">{currentZoneObj.cabbageColorName}</strong>
                </span>
              </div>
            </div>

            {/* Measured pH Meter Display */}
            <div className="rounded-2xl bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-slate-300 block">
                  Leitura do pHmetro digital
                </span>
                <span className="text-xs text-slate-400">
                  Associe este pH ao caráter ácido, neutro ou básico
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight">
                  pH {currentItem.exactPh.toFixed(1).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Red Cabbage pH Spectrum (0 to 14) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Escala de cores do repolho roxo (pH 0 a 14)</span>
            <span className="flex items-center gap-1">
              <Timer className="w-3.5 h-3.5" />
              <span>Selecione o caráter abaixo</span>
            </span>
          </div>

          <div className="relative pt-6 pb-1">
            {/* Marker pinned at product's exact pH */}
            <div
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-20"
              style={{ left: `${(currentItem.exactPh / 14) * 100}%` }}
            >
              <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[11px] font-bold whitespace-nowrap shadow-xs">
                pH {currentItem.exactPh.toFixed(1).replace('.', ',')}
              </span>
              <span className="w-0.5 h-2.5 bg-slate-900" />
            </div>

            <div className="h-5 rounded-xl overflow-hidden border border-slate-200 flex">
              <div className="h-full" style={{ width: '25%', background: '#E11D48' }} />
              <div className="h-full" style={{ width: '21.5%', background: '#A855F7' }} />
              <div className="h-full" style={{ width: '7%', background: '#6366F1' }} />
              <div className="h-full" style={{ width: '21.5%', background: '#0EA5E9' }} />
              <div className="h-full" style={{ width: '25%', background: '#10B981' }} />
            </div>

            <div className="mt-1.5 flex justify-between text-[11px] font-mono font-semibold text-slate-400 tabular-nums select-none">
              {PH_TICKS.map((t) => (
                <span key={t} className={t === 7 ? 'text-indigo-700 font-bold' : ''}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 5 Character Classification Buttons */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            Qual é a classificação dessa amostra?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {PH_ZONES.map((zone) => {
              const isChosen = submittedZone === zone.id;
              const isTrueZone = currentItem.zone === zone.id;

              let styleClasses =
                'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-900';
              if (isAnswered) {
                if (isTrueZone) {
                  styleClasses = 'text-white shadow-sm';
                } else if (isChosen && !isTrueZone) {
                  styleClasses = 'bg-rose-50 border-rose-300 text-rose-800';
                } else {
                  styleClasses = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={zone.id}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectCharacter(zone.id)}
                  style={
                    isAnswered && isTrueZone
                      ? { backgroundColor: zone.color, borderColor: zone.color }
                      : undefined
                  }
                  className={`min-h-[72px] p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${styleClasses}`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{
                      backgroundColor:
                        isAnswered && isTrueZone ? '#FFFFFF' : zone.cabbageHex,
                    }}
                  />
                  <div>
                    <span className="font-display font-bold text-sm sm:text-base leading-tight block">
                      {zone.label}
                    </span>
                    {isAnswered && (
                      <span
                        className={`font-mono text-xs tabular-nums ${
                          isTrueZone ? 'text-white/90' : 'opacity-75'
                        }`}
                      >
                        {zone.rangeLabel}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Immediate Feedback */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 font-display font-bold text-base">
                <span>
                  {isCorrect
                    ? `Classificação correta! ${currentZoneObj.label} (${currentZoneObj.rangeLabel})`
                    : `Classificação correta: ${currentZoneObj.label} (${currentZoneObj.rangeLabel})`}
                </span>
                {earnedPoints && (
                  <span className="font-mono text-sm text-emerald-700 tabular-nums">
                    +{earnedPoints.total} pts (100 + {earnedPoints.speed} rapidez)
                  </span>
                )}
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                {currentItem.explanation}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm inline-flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
          >
            <span>{index + 1 >= questions.length ? 'Concluir fase' : 'Próximo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Red Cabbage Color Guide Overlay Modal */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Guia de cores do indicador de repolho roxo"
          onClick={handleCloseGuide}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Guia do Indicador de Repolho Roxo
              </h2>
              <button
                type="button"
                onClick={handleCloseGuide}
                aria-label="Fechar guia"
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-2.5">
              {PH_ZONES.map((zone) => (
                <div
                  key={zone.id}
                  className="px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-lg shrink-0 border border-black/10"
                      style={{ background: zone.cabbageGradient }}
                    />
                    <div>
                      <span className="font-display font-bold text-sm text-slate-900 block">
                        {zone.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {zone.cabbageColorName}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-800 tabular-nums">
                    {zone.rangeLabel}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex justify-end">
              <button
                type="button"
                onClick={handleCloseGuide}
                className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-display font-bold text-sm transition-colors"
              >
                Fechar e continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
