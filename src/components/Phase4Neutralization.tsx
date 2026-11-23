import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, FlaskConical, Timer, XCircle } from 'lucide-react';
import {
  FUNCTION_META,
  NEUTRALIZATION_BANK,
  PHASE_META,
  shuffleArray,
} from '../data/chemistryData';
import { ChemFunction, NeutralizationItem, TurnResult } from '../types/game';
import { ChemFormula } from '../utils/formula';
import { soundEngine } from '../utils/sound';

interface Phase4NeutralizationProps {
  questionCount: number;
  playerName: string;
  onComplete: (result: TurnResult) => void;
}

const ROLE_COLOR_MAP: Record<'acid' | 'base' | 'salt', ChemFunction> = {
  acid: 'acid',
  base: 'base',
  salt: 'salt',
};

export const Phase4Neutralization: React.FC<Phase4NeutralizationProps> = ({
  questionCount,
  playerName,
  onComplete,
}) => {
  const questions = useMemo<NeutralizationItem[]>(
    () => shuffleArray(NEUTRALIZATION_BANK).slice(0, questionCount),
    [questionCount]
  );

  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [earnedPoints, setEarnedPoints] = useState<{
    total: number;
    speed: number;
  } | null>(null);

  const [scoreTotal, setScoreTotal] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const startTimeRef = useRef<number>(Date.now());
  const currentItem = questions[index];
  const shuffledOptions = useMemo(
    () => shuffleArray(currentItem.options),
    [currentItem]
  );

  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === currentItem.correctAnswer;

  useEffect(() => {
    startTimeRef.current = Date.now();
    setSelectedOption(null);
    setEarnedPoints(null);
  }, [index]);

  const handleChooseOption = (option: string) => {
    if (isAnswered) return;

    const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
    const speedBonus = Math.max(5, Math.min(50, Math.round(50 - elapsedSec * 3.5)));
    const hit = option === currentItem.correctAnswer;

    setSelectedOption(option);
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

  const missingRoleMeta = FUNCTION_META[ROLE_COLOR_MAP[currentItem.missingPosition]];

  const renderSlot = (formulaPart: string, roleLabel: string, roleColor: string) => {
    const isGap = formulaPart === '?';
    if (!isGap) {
      return (
        <div className="px-4 py-3 sm:px-5 sm:py-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center min-w-[92px] sm:min-w-[120px]">
          <ChemFormula
            formula={formulaPart}
            className="text-xl sm:text-3xl font-bold text-slate-900"
          />
          <span className="text-[11px] font-semibold mt-1" style={{ color: roleColor }}>
            {roleLabel}
          </span>
        </div>
      );
    }

    // Gap slot
    let gapStyles = 'border-dashed border-2 border-slate-400 bg-slate-50/60 text-slate-400';
    let displayedFormula = '?';
    if (isAnswered) {
      displayedFormula = currentItem.correctAnswer;
      gapStyles = isCorrect
        ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-900'
        : 'border-2 border-rose-400 bg-rose-50 text-rose-900';
    }

    return (
      <div
        className={`px-4 py-3 sm:px-5 sm:py-4 rounded-2xl flex flex-col items-center justify-center min-w-[112px] sm:min-w-[140px] transition-all ${gapStyles}`}
      >
        {displayedFormula === '?' ? (
          <span className="font-mono text-2xl sm:text-3xl font-bold">[ ? ]</span>
        ) : (
          <ChemFormula
            formula={displayedFormula}
            className="text-xl sm:text-3xl font-bold"
          />
        )}
        <span
          className="text-[11px] font-bold mt-1"
          style={{ color: missingRoleMeta.color }}
        >
          {missingRoleMeta.label} esperado
        </span>
      </div>
    );
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {PHASE_META[4].title} · {playerName}
          </p>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Complete a reação de neutralização
          </h1>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 text-slate-600">
            <Timer className="w-4 h-4 text-slate-400" />
            <span>Ácido + Base → Sal + Água</span>
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="font-mono font-bold text-slate-900 tabular-nums">
            {index + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Equation Simulator Card */}
      <motion.section
        key={currentItem.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 ${
          isAnswered && !isCorrect ? 'animate-shake' : ''
        }`}
      >
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <FlaskConical className="w-4 h-4" />
          <span>Equação química balanceada</span>
        </div>

        {/* Equation Layout */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
          {renderSlot(
            currentItem.leftParts[0],
            'Ácido',
            FUNCTION_META.acid.color
          )}
          <span className="font-mono text-2xl font-bold text-slate-400">+</span>
          {renderSlot(
            currentItem.leftParts[1],
            'Base',
            FUNCTION_META.base.color
          )}
          <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-700 px-1">
            →
          </span>
          {renderSlot(
            currentItem.rightParts[0],
            'Sal',
            FUNCTION_META.salt.color
          )}
          <span className="font-mono text-2xl font-bold text-slate-400">+</span>
          {renderSlot(currentItem.rightParts[1], 'Água', '#0284C7')}
        </div>

        {/* Clickable Formula Blocks */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 text-center">
            Selecione o bloco de fórmula que completa a reação corretamente:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {shuffledOptions.map((opt) => {
              const isChosen = selectedOption === opt;
              const isAnswer = opt === currentItem.correctAnswer;

              let btnClass =
                'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-900 hover:-translate-y-0.5';
              if (isAnswered) {
                if (isAnswer) {
                  btnClass = 'bg-emerald-600 border-emerald-600 text-white shadow-sm';
                } else if (isChosen && !isAnswer) {
                  btnClass = 'bg-rose-100 border-rose-400 text-rose-900';
                } else {
                  btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleChooseOption(opt)}
                  className={`min-h-[76px] rounded-2xl border-2 px-4 py-3 flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${btnClass}`}
                >
                  <ChemFormula
                    formula={opt}
                    className="text-xl sm:text-2xl font-bold"
                  />
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
                    ? 'Neutralização equilibrada!'
                    : `Equação completa: ${currentItem.fullEquation}`}
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
            <span>{index + 1 >= questions.length ? 'Ver resultado final' : 'Próximo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </main>
  );
};
