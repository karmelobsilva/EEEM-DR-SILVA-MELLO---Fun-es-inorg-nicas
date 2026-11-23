import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, CheckCircle2, Link2, Table2, Timer, XCircle } from 'lucide-react';
import {
  FUNCTION_META,
  PHASE_META,
  sampleBalancedCompounds,
  shuffleArray,
} from '../data/chemistryData';
import { CompoundItem, TurnResult } from '../types/game';
import { ChemFormula } from '../utils/formula';
import { soundEngine } from '../utils/sound';
import { ReferenceModal } from './ReferenceModals';

interface Phase2NomenclatureProps {
  roundCount: number; // 2 for solo (8 pairs), 1 for teams (4 pairs)
  playerName: string;
  onComplete: (result: TurnResult) => void;
}

interface LineCoord {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

export const Phase2Nomenclature: React.FC<Phase2NomenclatureProps> = ({
  roundCount,
  playerName,
  onComplete,
}) => {
  const boards = useMemo<CompoundItem[][]>(() => {
    const used = new Set<string>();
    const list: CompoundItem[][] = [];
    for (let r = 0; r < roundCount; r++) {
      const batch = sampleBalancedCompounds(4, {
        excludeIds: used,
        excludeAmmonium: true,
        excludePeroxides: true,
      });
      batch.forEach((b) => used.add(b.id));
      list.push(batch);
    }
    return list;
  }, [roundCount]);

  const [boardIndex, setBoardIndex] = useState(0);
  const currentLeftItems = boards[boardIndex];
  const currentRightItems = useMemo(
    () => shuffleArray(currentLeftItems),
    [currentLeftItems]
  );

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [errorPair, setErrorPair] = useState<{ leftId: string; rightId: string } | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    title: string;
    detail: string;
  } | null>(null);

  const [scoreTotal, setScoreTotal] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const [activeModal, setActiveModal] = useState<'periodic' | 'anions' | null>(null);
  const modalOpenedAtRef = useRef<number | null>(null);
  const lastActionTimeRef = useRef<number>(Date.now());
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [lines, setLines] = useState<LineCoord[]>([]);

  const handleOpenModal = (type: 'periodic' | 'anions') => {
    soundEngine.playClick();
    modalOpenedAtRef.current = Date.now();
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    if (modalOpenedAtRef.current !== null) {
      lastActionTimeRef.current += Date.now() - modalOpenedAtRef.current;
      modalOpenedAtRef.current = null;
    }
    setActiveModal(null);
  };

  // Reset board state on board change
  useEffect(() => {
    setSelectedLeftId(null);
    setSelectedRightId(null);
    setMatchedIds([]);
    setErrorPair(null);
    setFeedback(null);
    lastActionTimeRef.current = Date.now();
  }, [boardIndex]);

  const computeLines = useCallback(() => {
    const container = gridContainerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    const newLines: LineCoord[] = [];
    matchedIds.forEach((id) => {
      const leftEl = leftRefs.current[id];
      const rightEl = rightRefs.current[id];
      const item = currentLeftItems.find((c) => c.id === id);
      if (!leftEl || !rightEl || !item) return;

      const lRect = leftEl.getBoundingClientRect();
      const rRect = rightEl.getBoundingClientRect();
      newLines.push({
        id,
        x1: lRect.right - containerRect.left,
        y1: lRect.top + lRect.height / 2 - containerRect.top,
        x2: rRect.left - containerRect.left,
        y2: rRect.top + rRect.height / 2 - containerRect.top,
        color: FUNCTION_META[item.func].color,
      });
    });
    setLines(newLines);
  }, [matchedIds, currentLeftItems]);

  useLayoutEffect(() => {
    computeLines();
    window.addEventListener('resize', computeLines);
    return () => window.removeEventListener('resize', computeLines);
  }, [computeLines]);

  const evaluatePair = (leftId: string, rightId: string) => {
    const leftItem = currentLeftItems.find((c) => c.id === leftId);
    const rightItem = currentRightItems.find((c) => c.id === rightId);
    if (!leftItem || !rightItem) return;

    const nextAnswered = answeredCount + 1;
    setAnsweredCount(nextAnswered);

    if (leftId === rightId) {
      const elapsedSec = (Date.now() - lastActionTimeRef.current) / 1000;
      const speedBonus = Math.max(5, Math.min(50, Math.round(50 - elapsedSec * 4)));
      const earned = 100 + speedBonus;

      const nextMatched = [...matchedIds, leftId];
      const nextScore = scoreTotal + earned;
      const nextCorrect = correctCount + 1;

      setMatchedIds(nextMatched);
      setScoreTotal(nextScore);
      setCorrectCount(nextCorrect);
      setSelectedLeftId(null);
      setSelectedRightId(null);
      setErrorPair(null);
      lastActionTimeRef.current = Date.now();

      soundEngine.playCorrect(nextMatched.length);
      setFeedback({
        type: 'success',
        title: `Conexão certa! +${earned} pts`,
        detail: `${leftItem.name} (${FUNCTION_META[leftItem.func].label}) — +${speedBonus} de rapidez.`,
      });
    } else {
      soundEngine.playWrong();
      setErrorPair({ leftId, rightId });
      setSelectedLeftId(null);
      setSelectedRightId(null);
      setFeedback({
        type: 'error',
        title: 'Combinação incorreta',
        detail: `A fórmula selecionada é ${leftItem.name} (${FUNCTION_META[leftItem.func].label}), enquanto "${rightItem.name}" pertence a outro composto.`,
      });
      window.setTimeout(() => {
        setErrorPair(null);
      }, 450);
    }
  };

  const handleLeftClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    soundEngine.playClick();
    if (selectedRightId) {
      evaluatePair(id, selectedRightId);
    } else {
      setSelectedLeftId((prev) => (prev === id ? null : id));
    }
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    soundEngine.playClick();
    if (selectedLeftId) {
      evaluatePair(selectedLeftId, id);
    } else {
      setSelectedRightId((prev) => (prev === id ? null : id));
    }
  };

  const isBoardComplete = matchedIds.length === currentLeftItems.length;

  const handleAdvance = () => {
    soundEngine.playClick();
    if (boardIndex + 1 < boards.length) {
      setBoardIndex((prev) => prev + 1);
    } else {
      soundEngine.playPhaseComplete();
      onComplete({
        scoreDelta: scoreTotal,
        answeredDelta: answeredCount,
        correctDelta: correctCount,
      });
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {PHASE_META[2].title} · {playerName}
          </p>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Conecte cada fórmula ao seu nome oficial
          </h1>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 text-slate-600 tabular-nums">
            <Link2 className="w-4 h-4 text-slate-400" />
            <span>
              {matchedIds.length}/{currentLeftItems.length} pares
            </span>
          </span>
          {boards.length > 1 && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                Bloco {boardIndex + 1}/{boards.length}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Consultation Resources Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200 px-4 py-3 shadow-xs">
        <span className="text-xs sm:text-sm font-medium text-slate-600">
          Precisa conferir um elemento ou ânion?
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleOpenModal('periodic')}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-800 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Table2 className="w-4 h-4 text-blue-600" />
            <span>Tabela Periódica</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenModal('anions')}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-slate-800 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-rose-600" />
            <span>Tabela de Ânions</span>
          </button>
        </div>
      </div>

      {/* Matching Board */}
      <section className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:gap-12 text-xs font-bold text-slate-400 px-1">
          <span>Fórmulas químicas</span>
          <span>Nomenclatura oficial</span>
        </div>

        <div
          ref={gridContainerRef}
          className="relative grid grid-cols-2 gap-4 sm:gap-14 items-stretch"
        >
          {/* SVG Connector Lines Overlay */}
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full z-10 overflow-visible"
            aria-hidden="true"
          >
            {lines.map((line) => (
              <g key={line.id}>
                <path
                  d={`M ${line.x1} ${line.y1} C ${(line.x1 + line.x2) / 2} ${line.y1}, ${(line.x1 + line.x2) / 2} ${line.y2}, ${line.x2} ${line.y2}`}
                  fill="none"
                  stroke={line.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                <circle cx={line.x1} cy={line.y1} r="4.5" fill={line.color} />
                <circle cx={line.x2} cy={line.y2} r="4.5" fill={line.color} />
              </g>
            ))}
          </svg>

          {/* Left Column: Formulas */}
          <div className="space-y-3 z-20">
            {currentLeftItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedLeftId === item.id;
              const isError = errorPair?.leftId === item.id;
              const meta = FUNCTION_META[item.func];

              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    leftRefs.current[item.id] = el;
                  }}
                  type="button"
                  disabled={isMatched}
                  onClick={() => handleLeftClick(item.id)}
                  style={
                    isMatched
                      ? {
                          borderColor: meta.color,
                          backgroundColor: `${meta.color}12`,
                        }
                      : undefined
                  }
                  className={`w-full min-h-[68px] sm:min-h-[76px] px-4 py-3 rounded-2xl border-2 flex items-center justify-between gap-2 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isError ? 'animate-shake border-rose-500 bg-rose-50' : ''
                  } ${
                    isMatched
                      ? 'cursor-default'
                      : isSelected
                        ? 'border-blue-600 bg-blue-50 shadow-sm scale-[1.01]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <ChemFormula
                    formula={item.formula}
                    className="text-xl sm:text-2xl font-bold text-slate-900"
                  />
                  {isMatched && (
                    <span
                      className="text-xs font-bold shrink-0"
                      style={{ color: meta.color }}
                    >
                      {meta.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Official Names */}
          <div className="space-y-3 z-20">
            {currentRightItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedRightId === item.id;
              const isError = errorPair?.rightId === item.id;
              const meta = FUNCTION_META[item.func];

              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    rightRefs.current[item.id] = el;
                  }}
                  type="button"
                  disabled={isMatched}
                  onClick={() => handleRightClick(item.id)}
                  style={
                    isMatched
                      ? {
                          borderColor: meta.color,
                          backgroundColor: `${meta.color}12`,
                        }
                      : undefined
                  }
                  className={`w-full min-h-[68px] sm:min-h-[76px] px-4 py-3 rounded-2xl border-2 flex items-center justify-between gap-2 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isError ? 'animate-shake border-rose-500 bg-rose-50' : ''
                  } ${
                    isMatched
                      ? 'cursor-default'
                      : isSelected
                        ? 'border-blue-600 bg-blue-50 shadow-sm scale-[1.01]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-900 leading-snug">
                    {item.name}
                  </span>
                  {isMatched && (
                    <CheckCircle2
                      className="w-5 h-5 shrink-0"
                      style={{ color: meta.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pedagogical Feedback & Next Button */}
        {feedback ? (
          <motion.div
            key={feedback.title + feedback.detail}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-display font-bold text-sm sm:text-base">
                  {feedback.title}
                </p>
                <p className="text-xs sm:text-sm opacity-90">{feedback.detail}</p>
              </div>
            </div>

            {isBoardComplete && (
              <button
                type="button"
                onClick={handleAdvance}
                className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm inline-flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <span>
                  {boardIndex + 1 < boards.length ? 'Próximo bloco' : 'Concluir fase'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ) : (
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
            <Timer className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Toque em uma fórmula à esquerda e depois no nome oficial correspondente à direita para conectar os pares.
            </span>
          </div>
        )}
      </section>

      {activeModal && (
        <ReferenceModal type={activeModal} onClose={handleCloseModal} />
      )}
    </main>
  );
};
