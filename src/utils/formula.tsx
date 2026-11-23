import React from 'react';

interface ChemFormulaProps {
  formula: string;
  className?: string;
}

/**
 * Renders chemical formulas with proper stoichiometric subscripts.
 * Leading stoichiometric coefficients (e.g. "2H2O", "3NaOH") stay normal-sized,
 * while element/group counts ("H2SO4", "Ca(OH)2") become subscripts.
 */
export const ChemFormula: React.FC<ChemFormulaProps> = ({ formula, className = '' }) => {
  if (formula === '?') {
    return <span className={className}>?</span>;
  }

  // Separate optional leading stoichiometric coefficient from the formula body
  const match = formula.match(/^(\d+)?(.*)$/);
  const coeff = match?.[1] ?? '';
  const body = match?.[2] ?? formula;

  const tokens: React.ReactNode[] = [];
  if (coeff) {
    tokens.push(
      <span key="coeff" className="font-semibold opacity-90 mr-0.5">
        {coeff}
      </span>
    );
  }

  // Split digits that represent atom counts inside the formula
  const parts = body.split(/(\d+)/);
  parts.forEach((part, index) => {
    if (!part) return;
    if (/^\d+$/.test(part)) {
      tokens.push(
        <sub key={`sub-${index}`} className="text-[0.68em] leading-none font-semibold align-baseline relative -bottom-[0.2em]">
          {part}
        </sub>
      );
    } else {
      tokens.push(<span key={`txt-${index}`}>{part}</span>);
    }
  });

  return (
    <span className={`font-mono tracking-tight inline-flex items-baseline ${className}`}>
      {tokens}
    </span>
  );
};
