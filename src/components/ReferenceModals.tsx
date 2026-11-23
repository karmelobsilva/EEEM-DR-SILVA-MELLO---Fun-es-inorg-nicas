import React, { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import {
  ANION_GROUPS,
  ELEMENT_CATEGORY_LABELS,
  PERIODIC_ELEMENTS,
  PeriodicElement,
} from '../data/referenceData';
import { ChemFormula } from '../utils/formula';
import { soundEngine } from '../utils/sound';

interface ReferenceModalProps {
  type: 'periodic' | 'anions';
  onClose: () => void;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({ type, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<PeriodicElement>(
    PERIODIC_ELEMENTS.find((e) => e.symbol === 'Fe') ?? PERIODIC_ELEMENTS[0]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const normalizedQuery = query
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const matchingElements = useMemo(() => {
    if (!normalizedQuery) return new Set<number>();
    return new Set(
      PERIODIC_ELEMENTS.filter((el) => {
        const nameNorm = el.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const symNorm = el.symbol.toLowerCase();
        return (
          nameNorm.includes(normalizedQuery) ||
          symNorm.includes(normalizedQuery) ||
          String(el.z) === normalizedQuery
        );
      }).map((e) => e.z)
    );
  }, [normalizedQuery]);

  const filteredAnionGroups = useMemo(() => {
    if (!normalizedQuery) return ANION_GROUPS;
    return ANION_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const nameNorm = item.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const formulaNorm = item.formula.toLowerCase();
        const originNorm = item.acidOrigin
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        return (
          nameNorm.includes(normalizedQuery) ||
          formulaNorm.includes(normalizedQuery) ||
          originNorm.includes(normalizedQuery)
        );
      }),
    })).filter((g) => g.items.length > 0);
  }, [normalizedQuery]);

  const handleClose = () => {
    soundEngine.playClick();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={
        type === 'periodic' ? 'Tabela Periódica dos Elementos' : 'Tabela de Ânions'
      }
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/70">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
              {type === 'periodic'
                ? 'Tabela Periódica — Símbolos e Nomes'
                : 'Tabela de Ânions Inorgânicos'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {type === 'periodic'
                ? 'Consulte ou toque em qualquer elemento para ver o nome completo. Sua partida continua pausada.'
                : 'Consulte a fórmula, carga e nomenclatura dos principais ânions.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar janela de consulta"
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="px-5 sm:px-6 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                type === 'periodic'
                  ? 'Buscar elemento (ex: Ferro, Cu, Bário, S)...'
                  : 'Buscar ânion (ex: Sulfato, NO3, Cloreto)...'
              }
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {type === 'periodic' ? (
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm">
              <span className="font-mono font-bold text-slate-500 tabular-nums">
                Z={selectedElement.z}
              </span>
              <span className="font-mono font-extrabold text-lg text-slate-900">
                {selectedElement.symbol}
              </span>
              <span className="font-bold text-slate-900">
                {selectedElement.name}
              </span>
              <span className="text-xs text-slate-500 hidden md:inline">
                ({ELEMENT_CATEGORY_LABELS[selectedElement.category].label})
              </span>
            </div>
          ) : (
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
              <span className="font-bold text-slate-800">Regra rápida:</span> Ácido{' '}
              <span className="font-mono font-semibold">-ídrico</span> →{' '}
              <span className="font-mono font-semibold">-eto</span> ·{' '}
              <span className="font-mono font-semibold">-ico</span> →{' '}
              <span className="font-mono font-semibold">-ato</span> ·{' '}
              <span className="font-mono font-semibold">-oso</span> →{' '}
              <span className="font-mono font-semibold">-ito</span>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {type === 'periodic' ? (
            <div className="space-y-4">
              {/* Quick search matches banner if searching */}
              {normalizedQuery && (
                <div className="flex flex-wrap gap-2 pb-2">
                  {PERIODIC_ELEMENTS.filter((el) => matchingElements.has(el.z)).map(
                    (el) => {
                      const cat = ELEMENT_CATEGORY_LABELS[el.category];
                      return (
                        <button
                          key={el.z}
                          type="button"
                          onClick={() => setSelectedElement(el)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${cat.bg} ${cat.border} ${cat.text}`}
                        >
                          <span className="font-mono">{el.z}</span>
                          <span className="font-mono font-bold text-sm">{el.symbol}</span>
                          <span>{el.name}</span>
                        </button>
                      );
                    }
                  )}
                  {matchingElements.size === 0 && (
                    <p className="text-sm text-slate-500">
                      Nenhum elemento encontrado para "{query}".
                    </p>
                  )}
                </div>
              )}

              {/* 18-Column Periodic Table Grid */}
              <div className="overflow-x-auto pb-2">
                <div
                  className="grid gap-1 min-w-[960px]"
                  style={{
                    gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
                    gridTemplateRows: 'repeat(9, auto)',
                  }}
                >
                  {PERIODIC_ELEMENTS.map((el) => {
                    const cat = ELEMENT_CATEGORY_LABELS[el.category];
                    const isMatch = normalizedQuery ? matchingElements.has(el.z) : true;
                    const isSelected = selectedElement.z === el.z;

                    return (
                      <button
                        key={el.z}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setSelectedElement(el);
                        }}
                        style={{
                          gridRowStart: el.row,
                          gridColumnStart: el.col,
                        }}
                        className={`p-1 rounded-lg border text-left transition-all flex flex-col justify-between min-h-[54px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${cat.bg} ${cat.border} ${cat.text} ${
                          isSelected ? 'ring-2 ring-slate-900 scale-[1.04] z-10 shadow-sm' : ''
                        } ${!isMatch ? 'opacity-25' : 'hover:brightness-95'}`}
                      >
                        <span className="text-[9px] font-mono leading-none opacity-75 tabular-nums">
                          {el.z}
                        </span>
                        <span className="font-mono font-extrabold text-sm leading-tight">
                          {el.symbol}
                        </span>
                        <span className="text-[9px] font-medium leading-none truncate w-full">
                          {el.name}
                        </span>
                      </button>
                    );
                  })}

                  {/* Placeholder markers for Lanthanides/Actinides in main block */}
                  <div
                    style={{ gridRowStart: 6, gridColumnStart: 3 }}
                    className="p-1 rounded-lg border border-dashed border-orange-300 bg-orange-50/50 text-orange-800 flex flex-col items-center justify-center text-[10px] font-mono font-semibold"
                  >
                    57–71
                  </div>
                  <div
                    style={{ gridRowStart: 7, gridColumnStart: 3 }}
                    className="p-1 rounded-lg border border-dashed border-pink-300 bg-pink-50/50 text-pink-800 flex flex-col items-center justify-center text-[10px] font-mono font-semibold"
                  >
                    89–103
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Anions Table Content */
            <div className="space-y-6">
              {filteredAnionGroups.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  Nenhum ânion encontrado para "{query}".
                </p>
              ) : (
                filteredAnionGroups.map((group) => (
                  <section key={group.title} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h3 className="font-display font-bold text-base text-slate-900">
                        {group.title}
                      </h3>
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {group.chargeLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {group.items.map((anion) => (
                        <div
                          key={anion.formula + anion.name}
                          className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 flex items-center gap-3.5"
                        >
                          <div className="w-16 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <span className="inline-flex items-baseline">
                              <ChemFormula
                                formula={anion.formula}
                                className="text-base font-bold text-slate-900"
                              />
                              <sup className="font-mono text-xs font-bold text-rose-600 ml-0.5">
                                {anion.charge}
                              </sup>
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-display font-bold text-sm text-slate-900 truncate">
                              {anion.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {anion.acidOrigin}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Close & Continue */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-display font-bold text-sm transition-colors whitespace-nowrap"
          >
            Fechar e continuar resposta
          </button>
        </div>
      </div>
    </div>
  );
};
