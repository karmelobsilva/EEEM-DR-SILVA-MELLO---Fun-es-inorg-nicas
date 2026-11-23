export interface PeriodicElement {
  z: number;
  symbol: string;
  name: string;
  row: number;
  col: number;
  category:
    | 'nonmetal'
    | 'noble'
    | 'alkali'
    | 'alkaline'
    | 'metalloid'
    | 'halogen'
    | 'transition'
    | 'post_transition'
    | 'lanthanide'
    | 'actinide';
}

export const ELEMENT_CATEGORY_LABELS: Record<PeriodicElement['category'], { label: string; bg: string; border: string; text: string }> = {
  nonmetal: { label: 'Ametal', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900' },
  noble: { label: 'Gás Nobre', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900' },
  alkali: { label: 'Metal Alcalino', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900' },
  alkaline: { label: 'Alcalino-Terroso', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900' },
  metalloid: { label: 'Semimetal', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900' },
  halogen: { label: 'Halogênio', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-900' },
  transition: { label: 'Metal de Transição', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900' },
  post_transition: { label: 'Outro Metal', bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-900' },
  lanthanide: { label: 'Lantanídeo', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900' },
  actinide: { label: 'Actinídeo', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-900' },
};

export const PERIODIC_ELEMENTS: PeriodicElement[] = [
  // Period 1
  { z: 1, symbol: 'H', name: 'Hidrogênio', row: 1, col: 1, category: 'nonmetal' },
  { z: 2, symbol: 'He', name: 'Hélio', row: 1, col: 18, category: 'noble' },

  // Period 2
  { z: 3, symbol: 'Li', name: 'Lítio', row: 2, col: 1, category: 'alkali' },
  { z: 4, symbol: 'Be', name: 'Berílio', row: 2, col: 2, category: 'alkaline' },
  { z: 5, symbol: 'B', name: 'Boro', row: 2, col: 13, category: 'metalloid' },
  { z: 6, symbol: 'C', name: 'Carbono', row: 2, col: 14, category: 'nonmetal' },
  { z: 7, symbol: 'N', name: 'Nitrogênio', row: 2, col: 15, category: 'nonmetal' },
  { z: 8, symbol: 'O', name: 'Oxigênio', row: 2, col: 16, category: 'nonmetal' },
  { z: 9, symbol: 'F', name: 'Flúor', row: 2, col: 17, category: 'halogen' },
  { z: 10, symbol: 'Ne', name: 'Neônio', row: 2, col: 18, category: 'noble' },

  // Period 3
  { z: 11, symbol: 'Na', name: 'Sódio', row: 3, col: 1, category: 'alkali' },
  { z: 12, symbol: 'Mg', name: 'Magnésio', row: 3, col: 2, category: 'alkaline' },
  { z: 13, symbol: 'Al', name: 'Alumínio', row: 3, col: 13, category: 'post_transition' },
  { z: 14, symbol: 'Si', name: 'Silício', row: 3, col: 14, category: 'metalloid' },
  { z: 15, symbol: 'P', name: 'Fósforo', row: 3, col: 15, category: 'nonmetal' },
  { z: 16, symbol: 'S', name: 'Enxofre', row: 3, col: 16, category: 'nonmetal' },
  { z: 17, symbol: 'Cl', name: 'Cloro', row: 3, col: 17, category: 'halogen' },
  { z: 18, symbol: 'Ar', name: 'Argônio', row: 3, col: 18, category: 'noble' },

  // Period 4
  { z: 19, symbol: 'K', name: 'Potássio', row: 4, col: 1, category: 'alkali' },
  { z: 20, symbol: 'Ca', name: 'Cálcio', row: 4, col: 2, category: 'alkaline' },
  { z: 21, symbol: 'Sc', name: 'Escândio', row: 4, col: 3, category: 'transition' },
  { z: 22, symbol: 'Ti', name: 'Titânio', row: 4, col: 4, category: 'transition' },
  { z: 23, symbol: 'V', name: 'Vanádio', row: 4, col: 5, category: 'transition' },
  { z: 24, symbol: 'Cr', name: 'Cromo', row: 4, col: 6, category: 'transition' },
  { z: 25, symbol: 'Mn', name: 'Manganês', row: 4, col: 7, category: 'transition' },
  { z: 26, symbol: 'Fe', name: 'Ferro', row: 4, col: 8, category: 'transition' },
  { z: 27, symbol: 'Co', name: 'Cobalto', row: 4, col: 9, category: 'transition' },
  { z: 28, symbol: 'Ni', name: 'Níquel', row: 4, col: 10, category: 'transition' },
  { z: 29, symbol: 'Cu', name: 'Cobre', row: 4, col: 11, category: 'transition' },
  { z: 30, symbol: 'Zn', name: 'Zinco', row: 4, col: 12, category: 'transition' },
  { z: 31, symbol: 'Ga', name: 'Gálio', row: 4, col: 13, category: 'post_transition' },
  { z: 32, symbol: 'Ge', name: 'Germânio', row: 4, col: 14, category: 'metalloid' },
  { z: 33, symbol: 'As', name: 'Arsênio', row: 4, col: 15, category: 'metalloid' },
  { z: 34, symbol: 'Se', name: 'Selênio', row: 4, col: 16, category: 'nonmetal' },
  { z: 35, symbol: 'Br', name: 'Bromo', row: 4, col: 17, category: 'halogen' },
  { z: 36, symbol: 'Kr', name: 'Criptônio', row: 4, col: 18, category: 'noble' },

  // Period 5
  { z: 37, symbol: 'Rb', name: 'Rubídio', row: 5, col: 1, category: 'alkali' },
  { z: 38, symbol: 'Sr', name: 'Estrôncio', row: 5, col: 2, category: 'alkaline' },
  { z: 39, symbol: 'Y', name: 'Ítrio', row: 5, col: 3, category: 'transition' },
  { z: 40, symbol: 'Zr', name: 'Zircônio', row: 5, col: 4, category: 'transition' },
  { z: 41, symbol: 'Nb', name: 'Nióbio', row: 5, col: 5, category: 'transition' },
  { z: 42, symbol: 'Mo', name: 'Molibdênio', row: 5, col: 6, category: 'transition' },
  { z: 43, symbol: 'Tc', name: 'Tecnécio', row: 5, col: 7, category: 'transition' },
  { z: 44, symbol: 'Ru', name: 'Rutênio', row: 5, col: 8, category: 'transition' },
  { z: 45, symbol: 'Rh', name: 'Ródio', row: 5, col: 9, category: 'transition' },
  { z: 46, symbol: 'Pd', name: 'Paládio', row: 5, col: 10, category: 'transition' },
  { z: 47, symbol: 'Ag', name: 'Prata', row: 5, col: 11, category: 'transition' },
  { z: 48, symbol: 'Cd', name: 'Cádmio', row: 5, col: 12, category: 'transition' },
  { z: 49, symbol: 'In', name: 'Índio', row: 5, col: 13, category: 'post_transition' },
  { z: 50, symbol: 'Sn', name: 'Estanho', row: 5, col: 14, category: 'post_transition' },
  { z: 51, symbol: 'Sb', name: 'Antimônio', row: 5, col: 15, category: 'metalloid' },
  { z: 52, symbol: 'Te', name: 'Telúrio', row: 5, col: 16, category: 'metalloid' },
  { z: 53, symbol: 'I', name: 'Iodo', row: 5, col: 17, category: 'halogen' },
  { z: 54, symbol: 'Xe', name: 'Xenônio', row: 5, col: 18, category: 'noble' },

  // Period 6
  { z: 55, symbol: 'Cs', name: 'Césio', row: 6, col: 1, category: 'alkali' },
  { z: 56, symbol: 'Ba', name: 'Bário', row: 6, col: 2, category: 'alkaline' },
  { z: 72, symbol: 'Hf', name: 'Háfnio', row: 6, col: 4, category: 'transition' },
  { z: 73, symbol: 'Ta', name: 'Tântalo', row: 6, col: 5, category: 'transition' },
  { z: 74, symbol: 'W', name: 'Tungstênio', row: 6, col: 6, category: 'transition' },
  { z: 75, symbol: 'Re', name: 'Rênio', row: 6, col: 7, category: 'transition' },
  { z: 76, symbol: 'Os', name: 'Ósmio', row: 6, col: 8, category: 'transition' },
  { z: 77, symbol: 'Ir', name: 'Irídio', row: 6, col: 9, category: 'transition' },
  { z: 78, symbol: 'Pt', name: 'Platina', row: 6, col: 10, category: 'transition' },
  { z: 79, symbol: 'Au', name: 'Ouro', row: 6, col: 11, category: 'transition' },
  { z: 80, symbol: 'Hg', name: 'Mercúrio', row: 6, col: 12, category: 'transition' },
  { z: 81, symbol: 'Tl', name: 'Tálio', row: 6, col: 13, category: 'post_transition' },
  { z: 82, symbol: 'Pb', name: 'Chumbo', row: 6, col: 14, category: 'post_transition' },
  { z: 83, symbol: 'Bi', name: 'Bismuto', row: 6, col: 15, category: 'post_transition' },
  { z: 84, symbol: 'Po', name: 'Polônio', row: 6, col: 16, category: 'metalloid' },
  { z: 85, symbol: 'At', name: 'Astato', row: 6, col: 17, category: 'halogen' },
  { z: 86, symbol: 'Rn', name: 'Radônio', row: 6, col: 18, category: 'noble' },

  // Period 7
  { z: 87, symbol: 'Fr', name: 'Frâncio', row: 7, col: 1, category: 'alkali' },
  { z: 88, symbol: 'Ra', name: 'Rádio', row: 7, col: 2, category: 'alkaline' },
  { z: 104, symbol: 'Rf', name: 'Rutherfórdio', row: 7, col: 4, category: 'transition' },
  { z: 105, symbol: 'Db', name: 'Dúbnio', row: 7, col: 5, category: 'transition' },
  { z: 106, symbol: 'Sg', name: 'Seabórgio', row: 7, col: 6, category: 'transition' },
  { z: 107, symbol: 'Bh', name: 'Bóhrio', row: 7, col: 7, category: 'transition' },
  { z: 108, symbol: 'Hs', name: 'Hássio', row: 7, col: 8, category: 'transition' },
  { z: 109, symbol: 'Mt', name: 'Meitnério', row: 7, col: 9, category: 'transition' },
  { z: 110, symbol: 'Ds', name: 'Darmstádtio', row: 7, col: 10, category: 'transition' },
  { z: 111, symbol: 'Rg', name: 'Roentgênio', row: 7, col: 11, category: 'transition' },
  { z: 112, symbol: 'Cn', name: 'Copernício', row: 7, col: 12, category: 'transition' },
  { z: 113, symbol: 'Nh', name: 'Nihônio', row: 7, col: 13, category: 'post_transition' },
  { z: 114, symbol: 'Fl', name: 'Fleróvio', row: 7, col: 14, category: 'post_transition' },
  { z: 115, symbol: 'Mc', name: 'Moscóvio', row: 7, col: 15, category: 'post_transition' },
  { z: 116, symbol: 'Lv', name: 'Livermório', row: 7, col: 16, category: 'post_transition' },
  { z: 117, symbol: 'Ts', name: 'Tenesso', row: 7, col: 17, category: 'halogen' },
  { z: 118, symbol: 'Og', name: 'Oganessônio', row: 7, col: 18, category: 'noble' },

  // Lanthanides (Row 8, Col 4..18)
  { z: 57, symbol: 'La', name: 'Lantânio', row: 8, col: 4, category: 'lanthanide' },
  { z: 58, symbol: 'Ce', name: 'Cério', row: 8, col: 5, category: 'lanthanide' },
  { z: 59, symbol: 'Pr', name: 'Praseodímio', row: 8, col: 6, category: 'lanthanide' },
  { z: 60, symbol: 'Nd', name: 'Neodímio', row: 8, col: 7, category: 'lanthanide' },
  { z: 61, symbol: 'Pm', name: 'Promécio', row: 8, col: 8, category: 'lanthanide' },
  { z: 62, symbol: 'Sm', name: 'Samário', row: 8, col: 9, category: 'lanthanide' },
  { z: 63, symbol: 'Eu', name: 'Európio', row: 8, col: 10, category: 'lanthanide' },
  { z: 64, symbol: 'Gd', name: 'Gadolínio', row: 8, col: 11, category: 'lanthanide' },
  { z: 65, symbol: 'Tb', name: 'Térbio', row: 8, col: 12, category: 'lanthanide' },
  { z: 66, symbol: 'Dy', name: 'Disprósio', row: 8, col: 13, category: 'lanthanide' },
  { z: 67, symbol: 'Ho', name: 'Hólmio', row: 8, col: 14, category: 'lanthanide' },
  { z: 68, symbol: 'Er', name: 'Érbio', row: 8, col: 15, category: 'lanthanide' },
  { z: 69, symbol: 'Tm', name: 'Túlio', row: 8, col: 16, category: 'lanthanide' },
  { z: 70, symbol: 'Yb', name: 'Itérbio', row: 8, col: 17, category: 'lanthanide' },
  { z: 71, symbol: 'Lu', name: 'Lutécio', row: 8, col: 18, category: 'lanthanide' },

  // Actinides (Row 9, Col 4..18)
  { z: 89, symbol: 'Ac', name: 'Actínio', row: 9, col: 4, category: 'actinide' },
  { z: 90, symbol: 'Th', name: 'Tório', row: 9, col: 5, category: 'actinide' },
  { z: 91, symbol: 'Pa', name: 'Protactínio', row: 9, col: 6, category: 'actinide' },
  { z: 92, symbol: 'U', name: 'Urânio', row: 9, col: 7, category: 'actinide' },
  { z: 93, symbol: 'Np', name: 'Netúnio', row: 9, col: 8, category: 'actinide' },
  { z: 94, symbol: 'Pu', name: 'Plutônio', row: 9, col: 9, category: 'actinide' },
  { z: 95, symbol: 'Am', name: 'Amerício', row: 9, col: 10, category: 'actinide' },
  { z: 96, symbol: 'Cm', name: 'Cúrio', row: 9, col: 11, category: 'actinide' },
  { z: 97, symbol: 'Bk', name: 'Berquélio', row: 9, col: 12, category: 'actinide' },
  { z: 98, symbol: 'Cf', name: 'Califórnio', row: 9, col: 13, category: 'actinide' },
  { z: 99, symbol: 'Es', name: 'Einstênio', row: 9, col: 14, category: 'actinide' },
  { z: 100, symbol: 'Fm', name: 'Férmio', row: 9, col: 15, category: 'actinide' },
  { z: 101, symbol: 'Md', name: 'Mendelévio', row: 9, col: 16, category: 'actinide' },
  { z: 102, symbol: 'No', name: 'Nobélio', row: 9, col: 17, category: 'actinide' },
  { z: 103, symbol: 'Lr', name: 'Laurêncio', row: 9, col: 18, category: 'actinide' },
];

export interface AnionItem {
  formula: string;
  charge: string;
  name: string;
  acidOrigin: string;
}

export interface AnionGroup {
  title: string;
  chargeLabel: string;
  items: AnionItem[];
}

export const ANION_GROUPS: AnionGroup[] = [
  {
    title: 'Ânions Monovalentes',
    chargeLabel: 'Carga 1−',
    items: [
      { formula: 'F', charge: '−', name: 'Fluoreto', acidOrigin: 'HF (Ácido fluorídrico)' },
      { formula: 'Cl', charge: '−', name: 'Cloreto', acidOrigin: 'HCl (Ácido clorídrico)' },
      { formula: 'Br', charge: '−', name: 'Brometo', acidOrigin: 'HBr (Ácido bromídrico)' },
      { formula: 'I', charge: '−', name: 'Iodeto', acidOrigin: 'HI (Ácido iodídrico)' },
      { formula: 'CN', charge: '−', name: 'Cianeto', acidOrigin: 'HCN (Ácido cianídrico)' },
      { formula: 'OH', charge: '−', name: 'Hidróxido (hidroxila)', acidOrigin: 'Grupo característico de bases' },
      { formula: 'NO3', charge: '−', name: 'Nitrato', acidOrigin: 'HNO₃ (Ácido nítrico)' },
      { formula: 'NO2', charge: '−', name: 'Nitrito', acidOrigin: 'HNO₂ (Ácido nitroso)' },
      { formula: 'ClO', charge: '−', name: 'Hipoclorito', acidOrigin: 'HClO (Ácido hipocloroso)' },
      { formula: 'ClO3', charge: '−', name: 'Clorato', acidOrigin: 'HClO₃ (Ácido clórico)' },
      { formula: 'HCO3', charge: '−', name: 'Bicarbonato (Hidrogenocarbonato)', acidOrigin: 'H₂CO₃ (1ª ionização)' },
      { formula: 'MnO4', charge: '−', name: 'Permanganato', acidOrigin: 'HMnO₄ (Ácido permangânico)' },
    ],
  },
  {
    title: 'Ânions Bivalentes',
    chargeLabel: 'Carga 2−',
    items: [
      { formula: 'O', charge: '2−', name: 'Óxido', acidOrigin: 'Presente nos óxidos comuns' },
      { formula: 'S', charge: '2−', name: 'Sulfeto', acidOrigin: 'H₂S (Ácido sulfídrico)' },
      { formula: 'SO4', charge: '2−', name: 'Sulfato', acidOrigin: 'H₂SO₄ (Ácido sulfúrico)' },
      { formula: 'SO3', charge: '2−', name: 'Sulfito', acidOrigin: 'H₂SO₃ (Ácido sulfuroso)' },
      { formula: 'CO3', charge: '2−', name: 'Carbonato', acidOrigin: 'H₂CO₃ (Ácido carbônico)' },
      { formula: 'CrO4', charge: '2−', name: 'Cromato', acidOrigin: 'H₂CrO₄ (Ácido crômico)' },
      { formula: 'Cr2O7', charge: '2−', name: 'Dicromato', acidOrigin: 'H₂Cr₂O₇ (Ácido dicrômico)' },
    ],
  },
  {
    title: 'Ânions Trivalentes e Tetravalentes',
    chargeLabel: 'Carga 3− / 4−',
    items: [
      { formula: 'N', charge: '3−', name: 'Nitreto', acidOrigin: 'NH₃ / sais binários' },
      { formula: 'P', charge: '3−', name: 'Fosfeto', acidOrigin: 'PH₃ / sais binários' },
      { formula: 'PO4', charge: '3−', name: 'Fosfato', acidOrigin: 'H₃PO₄ (Ácido fosfórico)' },
      { formula: 'PO3', charge: '3−', name: 'Fosfito', acidOrigin: 'H₃PO₃ (Ácido fosforoso)' },
      { formula: 'BO3', charge: '3−', name: 'Borato', acidOrigin: 'H₃BO₃ (Ácido bórico)' },
      { formula: 'C', charge: '4−', name: 'Carbeto', acidOrigin: 'Compostos binários com carbono' },
    ],
  },
];
