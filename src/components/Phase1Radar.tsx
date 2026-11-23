import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  HelpCircle,
  Timer,
  XCircle,
} from 'lucide-react';
import { FUNCTION_META, PHASE_META, sampleBalancedCompounds } from '../data/chemistryData';
import { ChemFunction, CompoundItem, TurnResult } from '../types/game';
import { ChemFormula } from '../utils/formula';
import { soundEngine } from '../utils/sound';

interface Phase1RadarProps {
  questionCount: number;
  playerName: string;
  onComplete: (result: TurnResult) => void;
}

const FUNCTIONS_ORDER: ChemFunction[] = ['acid', 'base', 'salt', 'oxide'];

export const Phase1Radar: React.FC<Phase1RadarProps> = ({
  questionCount,
  playerName,
  onComplete,
}) => {
  const questions = useMemo<CompoundItem[]>(
    () => sampleBalancedCompounds(questionCount, { excludeAmmonium: true }),
    [questionCount]
  );

  const [index, setIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedFunc, setSelectedFunc] = useState<ChemFunction | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [lastPoints, setLastPoints] = useState<{
    base: number;
    speed: number;
    comboMult: number;
    total: number;
  } | null>(null);

  const [scoreTotal, setScoreTotal] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const startTimeRef = useRef<number>(Date.now());
  const autoAdvanceRef = useRef<number | null>(null);

  const currentItem = questions[index];
  const isAnswered = selectedFunc !== null;
  const isCorrect = isAnswered && selectedFunc === currentItem.func;

  // Live timer for speed bonus visibility
  useEffect(() => {
    if (isAnswered) return;
    startTimeRef.current = Date.now();
    setElapsedMs(0);

    const interval = window.setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);

    return () => window.clearInterval(interval);
  }, [index, isAnswered]);

  // Cleanup auto-advance timer
  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) {
        window.clearTimeout(autoAdvanceRef.current);
      }
    };
  }, []);

  const currentSpeedBonusPreview = Math.max(
    5,
    Math.round(50 - (elapsedMs / 1000) * 3.5)
  );

  const advanceNext = (
    nextScore: number,
    nextAnswered: number,
    nextCorrect: number
  ) => {
    if (autoAdvanceRef.current) {
      window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    if (index + 1 >= questions.length) {
      soundEngine.playPhaseComplete();
      onComplete({
        scoreDelta: nextScore,
        answeredDelta: nextAnswered,
        correctDelta: nextCorrect,
      });
    } else {
      setSelectedFunc(null);
      setLastPoints(null);
      setShowHint(false);
      setIndex((prev) => prev + 1);
    }
  };

  const handleSelect = (fn: ChemFunction) => {
    if (isAnswered) return;

    const reactionMs = Date.now() - startTimeRef.current;
    const speedBonus = Math.max(5, Math.min(50, Math.round(50 - (reactionMs / 1000) * 3.5)));
    const hit = fn === currentItem.func;

    setSelectedFunc(fn);
    const nextAnswered = answeredCount + 1;
    setAnsweredCount(nextAnswered);

    if (hit) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      const comboMultiplier =
        nextCombo >= 4 ? 1.5 : nextCombo === 3 ? 1.25 : nextCombo === 2 ? 1.1 : 1;
      const earnedSpeed = Math.min(50, Math.round(speedBonus * comboMultiplier));
      const earnedTotal = 100 + earnedSpeed;

      const nextScore = scoreTotal + earnedTotal;
      const nextCorrect = correctCount + 1;
      setScoreTotal(nextScore);
      setCorrectCount(nextCorrect);
      setLastPoints({
        base: 100,
        speed: earnedSpeed,
        comboMult: comboMultiplier,
        total: earnedTotal,
      });
      soundEngine.playCorrect(nextCombo);

      autoAdvanceRef.current = window.setTimeout(() => {
        advanceNext(nextScore, nextAnswered, nextCorrect);
      }, 1250);
    } else {
      setCombo(0);
      setLastPoints(null);
      soundEngine.playWrong();
    }
  };

  // Keyboard shortcuts 1-4 for fast desktop/whiteboard interaction
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advanceNext(scoreTotal, answeredCount, correctCount);
        }
        return;
      }
      const keyMap: Record<string, ChemFunction> = {
        '1': 'acid',
        '2': 'base',
        '3': 'salt',
        '4': 'oxide',
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        handleSelect(keyMap[e.key]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const correctMeta = FUNCTION_META[currentItem.func];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Phase Header & Live Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {PHASE_META[1].title} · {playerName}
          </p>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Qual é a função química deste composto?
          </h1>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-slate-600 tabular-nums">
            <Timer className="w-4 h-4 text-slate-400" />
            <span>+{currentSpeedBonusPreview} pts rapidez</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div
            className={`flex items-center gap-1 font-bold tabular-nums transition-transform ${
              combo >= 2 ? 'text-amber-600 scale-105' : 'text-slate-600'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Combo {combo}x</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="font-mono font-bold text-slate-900 tabular-nums">
            {index + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Central Focal Formula Card */}
      <motion.section
        key={currentItem.id}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        className={`bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm space-y-4 ${
          isAnswered && !isCorrect ? 'animate-shake' : ''
        }`}
      >
        <p className="text-xs font-semibold tracking-wide text-slate-400">
          Fórmula química em análise
        </p>

        <div className="py-3">
          <ChemFormula
            formula={currentItem.formula}
            className="text-5xl sm:text-7xl font-bold text-slate-900"
          />
        </div>

        <div className="min-h-8 flex items-center justify-center">
          {!isAnswered ? (
            showHint ? (
              <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5">
                Dica: {currentItem.hint}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setShowHint(true);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ver dica funcional</span>
              </button>
            )
          ) : (
            <p className="text-base font-semibold text-slate-700">
              {currentItem.name}
            </p>
          )}
        </div>
      </motion.section>

      {/* Immediate Feedback Banner */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
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
                    ? 'Classificação correta!'
                    : `Resposta correta: ${correctMeta.label}`}
                </span>
                {lastPoints && (
                  <span className="font-mono text-sm text-emerald-700 tabular-nums">
                    +{lastPoints.total} pts ({lastPoints.base} + {lastPoints.speed} rapidez
                    {lastPoints.comboMult > 1 ? ` · Combo ${lastPoints.comboMult}x` : ''})
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
            onClick={() => {
              soundEngine.playClick();
              advanceNext(scoreTotal, answeredCount, correctCount);
            }}
            className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm inline-flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
          >
            <span>{index + 1 >= questions.length ? 'Concluir fase' : 'Próximo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* 4 Semantic Classification Buttons at the Base */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {FUNCTIONS_ORDER.map((fn, idx) => {
          const meta = FUNCTION_META[fn];
          const isChosen = selectedFunc === fn;
          const isAnswer = currentItem.func === fn;

          let cardStyle =
            'bg-white border-slate-200 hover:-translate-y-0.5 hover:shadow-md text-slate-900';
          if (isAnswered) {
            if (isAnswer) {
              cardStyle = 'text-white shadow-sm';
            } else if (isChosen && !isAnswer) {
              cardStyle = 'bg-slate-100 border-slate-300 text-slate-400 opacity-75';
            } else {
              cardStyle = 'bg-white border-slate-200 opacity-45 text-slate-400';
            }
          }

          return (
            <button
              key={fn}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(fn)}
              style={
                isAnswered && isAnswer
                  ? { backgroundColor: meta.color, borderColor: meta.color }
                  : undefined
              }
              className={`min-h-[88px] sm:min-h-[104px] rounded-2xl border-2 p-4 flex flex-col items-start justify-between text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 ${meta.ring} ${cardStyle}`}
            >
              <div className="w-full flex items-center justify-between gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: isAnswered && isAnswer ? '#FFFFFF' : meta.color,
                  }}
                />
                <span className="hidden sm:inline font-mono text-xs opacity-60">
                  [{idx + 1}]
                </span>
              </div>

              <div className="space-y-0.5 w-full">
                <span className="font-display font-bold text-lg sm:text-xl block">
                  {meta.label}
                </span>
                <span
                  className={`text-xs block truncate ${
                    isAnswered && isAnswer ? 'text-white/90' : 'text-slate-500'
                  }`}
                >
                  {meta.signature}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
};
