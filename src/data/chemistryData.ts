import {
  ChemFunction,
  CompoundItem,
  NeutralizationItem,
  PhItem,
  PhZoneId,
  PhaseId,
} from '../types/game';

export const FUNCTION_META: Record<
  ChemFunction,
  {
    label: string;
    plural: string;
    color: string;
    bgSoft: string;
    border: string;
    textDark: string;
    ring: string;
    signature: string;
  }
> = {
  acid: {
    label: 'Ácido',
    plural: 'Ácidos',
    color: '#F43F5E',
    bgSoft: 'bg-rose-50',
    border: 'border-rose-200',
    textDark: 'text-rose-700',
    ring: 'focus-visible:ring-rose-500',
    signature: 'Libera H⁺ em água',
  },
  base: {
    label: 'Base',
    plural: 'Bases',
    color: '#3B82F6',
    bgSoft: 'bg-blue-50',
    border: 'border-blue-200',
    textDark: 'text-blue-700',
    ring: 'focus-visible:ring-blue-500',
    signature: 'Grupo OH⁻ (hidroxila)',
  },
  salt: {
    label: 'Sal',
    plural: 'Sais',
    color: '#10B981',
    bgSoft: 'bg-emerald-50',
    border: 'border-emerald-200',
    textDark: 'text-emerald-700',
    ring: 'focus-visible:ring-emerald-500',
    signature: 'Cátion (≠ H⁺) + Ânion (≠ OH⁻)',
  },
  oxide: {
    label: 'Óxido',
    plural: 'Óxidos',
    color: '#F59E0B',
    bgSoft: 'bg-amber-50',
    border: 'border-amber-200',
    textDark: 'text-amber-800',
    ring: 'focus-visible:ring-amber-500',
    signature: 'Binário com oxigênio (O)',
  },
};

export const PHASE_META: Record<
  PhaseId,
  {
    title: string;
    shortTitle: string;
    subtitle: string;
    objective: string;
  }
> = {
  1: {
    title: 'Fase 1: Radar de Grupos Funcionais',
    shortTitle: 'Radar Funcional',
    subtitle: 'Classifique cada composto em Ácido, Base, Sal ou Óxido.',
    objective: 'Identificar funções através da composição e grupos funcionais.',
  },
  2: {
    title: 'Fase 2: Conexão de Nomenclatura',
    shortTitle: 'Nomenclatura',
    subtitle: 'Conecte cada fórmula química ao seu nome oficial.',
    objective: 'Dominar as regras gerais de nomenclatura inorgânica.',
  },
  3: {
    title: 'Fase 3: Laboratório de pH e Repolho Roxo',
    shortTitle: 'Lab de pH',
    subtitle: 'Analise o pH e a cor do indicador de repolho roxo para classificar cada amostra.',
    objective: 'Associar valores de pH e cores do indicador ao caráter ácido, neutro ou básico.',
  },
  4: {
    title: 'Fase 4: Simulador de Neutralização',
    shortTitle: 'Neutralização',
    subtitle: 'Complete a reação escolhendo o composto que preenche a lacuna.',
    objective: 'Compreender a formação de sais e água a partir de ácidos e bases.',
  },
};

export const TEAM_COLORS = [
  '#F43F5E',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#0EA5E9',
  '#EC4899',
  '#14B8A6',
];

export const COMPOUNDS_BANK: CompoundItem[] = [
  // Ácidos
  {
    id: 'hcl',
    formula: 'HCl',
    name: 'Ácido clorídrico',
    func: 'acid',
    hint: 'Hidrácido forte presente no suco gástrico',
    explanation: 'Inicia com hidrogênio ionizável (H⁺) e não possui oxigênio: é um ácido (hidrácido).',
  },
  {
    id: 'h2so4',
    formula: 'H2SO4',
    name: 'Ácido sulfúrico',
    func: 'acid',
    hint: 'Oxiácido forte muito usado em baterias',
    explanation: 'Possui 2 hidrogênios ionizáveis (H⁺) ligados ao ânion sulfato (SO₄²⁻): é um oxiácido forte.',
  },
  {
    id: 'hno3',
    formula: 'HNO3',
    name: 'Ácido nítrico',
    func: 'acid',
    hint: 'Oxiácido forte usado na produção de fertilizantes',
    explanation: 'Libera H⁺ em meio aquoso junto ao ânion nitrato (NO₃⁻), caracterizando um ácido.',
  },
  {
    id: 'h3po4',
    formula: 'H3PO4',
    name: 'Ácido fosfórico',
    func: 'acid',
    hint: 'Triácido moderado usado em refrigerantes tipo cola',
    explanation: 'Apresenta três hidrogênios ionizáveis ligados ao grupo fosfato (PO₄³⁻): é um ácido.',
  },
  {
    id: 'hcn',
    formula: 'HCN',
    name: 'Ácido cianídrico',
    func: 'acid',
    hint: 'Hidrácido fraco e altamente volátil',
    explanation: 'Composto molecular que inicia com H⁺ ligado ao ânion cianeto (CN⁻), sem oxigênio: ácido.',
  },
  {
    id: 'h2co3',
    formula: 'H2CO3',
    name: 'Ácido carbônico',
    func: 'acid',
    hint: 'Oxiácido fraco e instável presente em água com gás',
    explanation: 'Formado pela reação de CO₂ com água, libera H⁺ formando íons bicarbonato/carbonato.',
  },
  {
    id: 'h2s',
    formula: 'H2S',
    name: 'Ácido sulfídrico',
    func: 'acid',
    hint: 'Gás com odor característico de ovo podre',
    explanation: 'Hidrácido binário que ioniza em água liberando H⁺ e o ânion sulfeto (S²⁻).',
  },
  {
    id: 'hclo',
    formula: 'HClO',
    name: 'Ácido hipocloroso',
    func: 'acid',
    hint: 'Oxiácido fraco com ação desinfetante',
    explanation: 'Contém H⁺ ionizável, cloro com nox +1 e oxigênio: é um oxiácido.',
  },

  // Bases
  {
    id: 'naoh',
    formula: 'NaOH',
    name: 'Hidróxido de sódio',
    func: 'base',
    hint: 'Base forte conhecida como soda cáustica',
    explanation: 'Apresenta o cátion metálico Na⁺ ligado ao grupo hidroxila (OH⁻), definindo uma base.',
  },
  {
    id: 'caoh2',
    formula: 'Ca(OH)2',
    name: 'Hidróxido de cálcio',
    func: 'base',
    hint: 'Base forte usada na construção civil (cal hidratada)',
    explanation: 'Contém o cátion Ca²⁺ ligado a duas hidroxilas (OH⁻): é uma base de Arrhenius.',
  },
  {
    id: 'aloh3',
    formula: 'Al(OH)3',
    name: 'Hidróxido de alumínio',
    func: 'base',
    hint: 'Base fraca usada em medicamentos antiácidos',
    explanation: 'Possui o cátion Al³⁺ unido a três grupos hidroxila (OH⁻): trata-se de uma base.',
  },
  {
    id: 'nh4oh',
    formula: 'NH4OH',
    name: 'Hidróxido de amônio',
    func: 'base',
    hint: 'Única base comum sem metal na fórmula',
    explanation: 'Formado pelo cátion amônio (NH₄⁺) e a hidroxila (OH⁻), liberando OH⁻ em solução aquosa.',
    hasAmmonium: true,
  },
  {
    id: 'mgoh2',
    formula: 'Mg(OH)2',
    name: 'Hidróxido de magnésio',
    func: 'base',
    hint: 'Suspensão conhecida como leite de magnésia',
    explanation: 'Composto iônico com cátion Mg²⁺ e dois grupos OH⁻ (hidroxila): é uma base.',
  },
  {
    id: 'koh',
    formula: 'KOH',
    name: 'Hidróxido de potássio',
    func: 'base',
    hint: 'Base forte (potassa cáustica) usada em sabões moles',
    explanation: 'Metal alcalino K⁺ combinado com o grupo funcional hidroxila (OH⁻): é uma base forte.',
  },
  {
    id: 'feoh3',
    formula: 'Fe(OH)3',
    name: 'Hidróxido de ferro III',
    func: 'base',
    hint: 'Base insolúvel com ferro de nox +3',
    explanation: 'Apresenta o cátion Fe³⁺ ligado a três hidroxilas (OH⁻), logo é uma base.',
  },
  {
    id: 'lioh',
    formula: 'LiOH',
    name: 'Hidróxido de lítio',
    func: 'base',
    hint: 'Base forte usada na purificação de ar em espaçonaves',
    explanation: 'Metal alcalino Li⁺ ligado ao grupo hidroxila (OH⁻): trata-se de uma base.',
  },
  {
    id: 'baoh2',
    formula: 'Ba(OH)2',
    name: 'Hidróxido de bário',
    func: 'base',
    hint: 'Base forte formada por metal alcalino-terroso',
    explanation: 'Cátion Ba²⁺ combinado com duas hidroxilas (OH⁻): é uma base forte.',
  },

  // Sais
  {
    id: 'nacl',
    formula: 'NaCl',
    name: 'Cloreto de sódio',
    func: 'salt',
    hint: 'Principal componente do sal de cozinha',
    explanation: 'Formado por cátion diferente de H⁺ (Na⁺) e ânion diferente de OH⁻ (Cl⁻): é um sal.',
  },
  {
    id: 'caco3',
    formula: 'CaCO3',
    name: 'Carbonato de cálcio',
    func: 'salt',
    hint: 'Presente no mármore, calcário e casca de ovo',
    explanation: 'Composto iônico formado pelo cátion Ca²⁺ e o ânion carbonato (CO₃²⁻): é um sal.',
  },
  {
    id: 'nahco3',
    formula: 'NaHCO3',
    name: 'Bicarbonato de sódio',
    func: 'salt',
    hint: 'Hidrogenossal usado na culinária e como antiácido',
    explanation: 'É um hidrogenossal formado pelo cátion Na⁺ e o ânion bicarbonato (HCO₃⁻).',
  },
  {
    id: 'kno3',
    formula: 'KNO3',
    name: 'Nitrato de potássio',
    func: 'salt',
    hint: 'Sal utilizado em adubos e conservação de alimentos',
    explanation: 'Une o cátion K⁺ (≠ H⁺) ao ânion nitrato NO₃⁻ (≠ OH⁻), caracterizando um sal.',
  },
  {
    id: 'cuso4',
    formula: 'CuSO4',
    name: 'Sulfato de cobre II',
    func: 'salt',
    hint: 'Sal cristalino azulado usado em fungicidas',
    explanation: 'Formado pelo cátion metálico Cu²⁺ e pelo ânion sulfato (SO₄²⁻): é um sal.',
  },
  {
    id: 'nh4cl',
    formula: 'NH4Cl',
    name: 'Cloreto de amônio',
    func: 'salt',
    hint: 'Sal usado em pilhas secas e expectorantes',
    explanation: 'Composto pelo cátion amônio (NH₄⁺) e o ânion cloreto (Cl⁻), sem H⁺ ionizável nem OH⁻.',
    hasAmmonium: true,
  },
  {
    id: 'baso4',
    formula: 'BaSO4',
    name: 'Sulfato de bário',
    func: 'salt',
    hint: 'Sal insolúvel usado em exames de raio-X',
    explanation: 'União do cátion Ba²⁺ e do ânion sulfato (SO₄²⁻): é um sal neutro.',
  },
  {
    id: 'ki',
    formula: 'KI',
    name: 'Iodeto de potássio',
    func: 'salt',
    hint: 'Sal adicionado ao sal de cozinha para prevenir bócio',
    explanation: 'Composto pelo cátion K⁺ e pelo ânion iodeto (I⁻): é um sal binário.',
  },
  {
    id: 'na2so4',
    formula: 'Na2SO4',
    name: 'Sulfato de sódio',
    func: 'salt',
    hint: 'Sal usado na fabricação de detergentes e papel',
    explanation: 'Formado por dois cátions Na⁺ e o ânion sulfato (SO₄²⁻): trata-se de um sal.',
  },

  // Óxidos
  {
    id: 'co2',
    formula: 'CO2',
    name: 'Dióxido de carbono',
    func: 'oxide',
    hint: 'Gás produzido na respiração e fotossíntese',
    explanation: 'Composto binário (apenas 2 elementos: C e O) com oxigênio mais eletronegativo: é um óxido.',
  },
  {
    id: 'cao',
    formula: 'CaO',
    name: 'Óxido de cálcio',
    func: 'oxide',
    hint: 'Conhecido como cal virgem ou cal viva',
    explanation: 'Composto binário de cálcio e oxigênio (O²⁻): é um óxido básico.',
  },
  {
    id: 'fe2o3',
    formula: 'Fe2O3',
    name: 'Óxido de ferro III',
    func: 'oxide',
    hint: 'Principal componente da ferrugem e da hematita',
    explanation: 'Formado por apenas dois elementos (Fe³⁺ e O²⁻), sendo o oxigênio o mais eletronegativo: óxido.',
  },
  {
    id: 'so3',
    formula: 'SO3',
    name: 'Trióxido de enxofre',
    func: 'oxide',
    hint: 'Precursor da chuva ácida sulfúrica na atmosfera',
    explanation: 'Composto binário de enxofre e oxigênio: óxido ácido (anidrido sulfúrico).',
  },
  {
    id: 'h2o2',
    formula: 'H2O2',
    name: 'Peróxido de hidrogênio',
    func: 'oxide',
    hint: 'Conhecido popularmente como água oxigenada',
    explanation: 'Composto binário de hidrogênio e oxigênio (grupo peróxido O₂²⁻): pertence aos óxidos.',
    isPeroxideOrSuperoxide: true,
  },
  {
    id: 'mgo',
    formula: 'MgO',
    name: 'Óxido de magnésio',
    func: 'oxide',
    hint: 'Óxido refratário branco usado em fornos industriais',
    explanation: 'Substância binária formada por magnésio e oxigênio: é um óxido básico.',
  },
  {
    id: 'no2',
    formula: 'NO2',
    name: 'Dióxido de nitrogênio',
    func: 'oxide',
    hint: 'Gás poluente castanho-avermelhado de escapamentos',
    explanation: 'Composto binário de nitrogênio e oxigênio: é um óxido molecular.',
  },
  {
    id: 'al2o3',
    formula: 'Al2O3',
    name: 'Óxido de alumínio',
    func: 'oxide',
    hint: 'Presente na bauxita e em pedras preciosas como o rubi',
    explanation: 'Composto binário de alumínio (Al³⁺) e oxigênio (O²⁻): é um óxido anfótero.',
  },
  {
    id: 'so2',
    formula: 'SO2',
    name: 'Dióxido de enxofre',
    func: 'oxide',
    hint: 'Gás emitido por vulcões e queima de combustíveis fósseis',
    explanation: 'Composto binário formado por enxofre e oxigênio: trata-se de um óxido ácido.',
  },
];

export const PH_ZONES: {
  id: PhZoneId;
  label: string;
  rangeLabel: string;
  min: number;
  max: number;
  color: string;
  cabbageColorName: string;
  cabbageHex: string;
  cabbageGradient: string;
  cabbageNote: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}[] = [
  {
    id: 'strong_acid',
    label: 'Ácido Forte',
    rangeLabel: 'pH 0 – 3',
    min: 0,
    max: 3,
    color: '#E11D48',
    cabbageColorName: 'Vermelho intenso',
    cabbageHex: '#E11D48',
    cabbageGradient: 'linear-gradient(180deg, #FB7185 0%, #E11D48 100%)',
    cabbageNote: 'Em pH de 0 a 3, a antocianina do repolho roxo fica avermelhada.',
    bgClass: 'bg-rose-50 hover:bg-rose-100',
    borderClass: 'border-rose-300',
    textClass: 'text-rose-700',
  },
  {
    id: 'weak_acid',
    label: 'Ácido Fraco',
    rangeLabel: 'pH 4 – 6',
    min: 4,
    max: 6,
    color: '#A855F7',
    cabbageColorName: 'Lilás / Rosa-violeta',
    cabbageHex: '#A855F7',
    cabbageGradient: 'linear-gradient(180deg, #C084FC 0%, #9333EA 100%)',
    cabbageNote: 'Em pH de 4 a 6, o extrato muda do roxo para tons de lilás rosado.',
    bgClass: 'bg-purple-50 hover:bg-purple-100',
    borderClass: 'border-purple-300',
    textClass: 'text-purple-800',
  },
  {
    id: 'neutral',
    label: 'Neutro',
    rangeLabel: 'pH 7',
    min: 7,
    max: 7,
    color: '#6366F1',
    cabbageColorName: 'Roxo natural',
    cabbageHex: '#6366F1',
    cabbageGradient: 'linear-gradient(180deg, #818CF8 0%, #4F46E5 100%)',
    cabbageNote: 'Em pH 7, o indicador mantém sua cor roxa original.',
    bgClass: 'bg-indigo-50 hover:bg-indigo-100',
    borderClass: 'border-indigo-300',
    textClass: 'text-indigo-800',
  },
  {
    id: 'weak_base',
    label: 'Básico Fraco',
    rangeLabel: 'pH 8 – 10',
    min: 8,
    max: 10,
    color: '#0EA5E9',
    cabbageColorName: 'Azul / Azul-esverdeado',
    cabbageHex: '#0EA5E9',
    cabbageGradient: 'linear-gradient(180deg, #38BDF8 0%, #0284C7 100%)',
    cabbageNote: 'Em pH de 8 a 10, o extrato de repolho roxo assume coloração azulada.',
    bgClass: 'bg-sky-50 hover:bg-sky-100',
    borderClass: 'border-sky-300',
    textClass: 'text-sky-800',
  },
  {
    id: 'strong_base',
    label: 'Básico Forte',
    rangeLabel: 'pH 11 – 14',
    min: 11,
    max: 14,
    color: '#10B981',
    cabbageColorName: 'Verde / Amarelo-esverdeado',
    cabbageHex: '#10B981',
    cabbageGradient: 'linear-gradient(180deg, #34D399 0%, #059669 100%)',
    cabbageNote: 'Em pH de 11 a 14, o indicador torna-se verde-amarelado.',
    bgClass: 'bg-emerald-50 hover:bg-emerald-100',
    borderClass: 'border-emerald-300',
    textClass: 'text-emerald-800',
  },
];

export function getZoneForPhValue(ph: number): PhZoneId {
  if (ph <= 3.2) return 'strong_acid';
  if (ph <= 6.4) return 'weak_acid';
  if (ph <= 7.5) return 'neutral';
  if (ph <= 10.7) return 'weak_base';
  return 'strong_base';
}

export const PH_BANK: PhItem[] = [
  {
    id: 'ph-gastrico',
    commonName: 'Suco gástrico',
    formula: 'HCl',
    exactPh: 1.5,
    zone: 'strong_acid',
    explanation: 'O ácido clorídrico (HCl) ioniza totalmente em água, deixando o estômago altamente ácido (pH ~1,5).',
  },
  {
    id: 'ph-bateria',
    commonName: 'Ácido de bateria',
    formula: 'H2SO4',
    exactPh: 0.5,
    zone: 'strong_acid',
    explanation: 'O ácido sulfúrico (H₂SO₄) é um ácido forte com altíssima concentração de íons H⁺ (pH próximo a 0,5).',
  },
  {
    id: 'ph-limao',
    commonName: 'Suco de limão',
    formula: 'C6H8O7',
    exactPh: 2.2,
    zone: 'strong_acid',
    explanation: 'Rico em ácido cítrico, o suco de limão apresenta elevada acidez na faixa de pH entre 2,0 e 2,4.',
  },
  {
    id: 'ph-chuva-acida',
    commonName: 'Chuva ácida',
    formula: 'H2SO3',
    exactPh: 4.5,
    zone: 'weak_acid',
    explanation: 'Óxidos de enxofre formam ácido sulfuroso (H₂SO₃) diluído, gerando acidez moderada/fraca (pH ~4,5).',
  },
  {
    id: 'ph-refri',
    commonName: 'Água gaseificada',
    formula: 'H2CO3',
    exactPh: 4.2,
    zone: 'weak_acid',
    explanation: 'O CO₂ dissolvido gera ácido carbônico (H₂CO₃), um ácido fraco com pH em torno de 4,0 a 4,5.',
  },
  {
    id: 'ph-cafe',
    commonName: 'Café preto coado',
    formula: 'Ácidos orgânicos',
    exactPh: 5.2,
    zone: 'weak_acid',
    explanation: 'O café possui ácidos clorogênicos fracos, situando-se na faixa de ácido fraco (pH ~5,2).',
  },
  {
    id: 'ph-agua',
    commonName: 'Água pura destilada',
    formula: 'H2O',
    exactPh: 7.0,
    zone: 'neutral',
    explanation: 'A água pura a 25 °C possui concentrações iguais de H⁺ e OH⁻ (10⁻⁷ mol/L), tendo pH exatamente 7,0.',
  },
  {
    id: 'ph-nacl',
    commonName: 'Solução aquosa de sal',
    formula: 'NaCl (aq)',
    exactPh: 7.0,
    zone: 'neutral',
    explanation: 'O NaCl vem de ácido forte (HCl) e base forte (NaOH); seus íons não sofrem hidrólise, mantendo o pH neutro (7,0).',
  },
  {
    id: 'ph-bicarbonato',
    commonName: 'Solução de bicarbonato',
    formula: 'NaHCO3',
    exactPh: 8.4,
    zone: 'weak_base',
    explanation: 'O ânion bicarbonato sofre hidrólise básica suave em água, resultando em pH levemente alcalino (~8,4).',
  },
  {
    id: 'ph-leite-magnesia',
    commonName: 'Leite de magnésia',
    formula: 'Mg(OH)2',
    exactPh: 10.2,
    zone: 'weak_base',
    explanation: 'O hidróxido de magnésio é pouco solúvel e atua como base fraca, ideal para neutralizar acidez estomacal (pH ~10,2).',
  },
  {
    id: 'ph-amoniaco',
    commonName: 'Solução de amoníaco',
    formula: 'NH4OH',
    exactPh: 11.6,
    zone: 'strong_base',
    explanation: 'Soluções concentradas de limpeza com hidróxido de amônio atingem pH alcalino elevado (~11,6).',
  },
  {
    id: 'ph-soda',
    commonName: 'Soda cáustica',
    formula: 'NaOH',
    exactPh: 13.8,
    zone: 'strong_base',
    explanation: 'O hidróxido de sódio é uma base forte que se dissocia 100%, liberando grande quantidade de OH⁻ (pH ~13,8).',
  },
  {
    id: 'ph-cal',
    commonName: 'Água de cal',
    formula: 'Ca(OH)2',
    exactPh: 12.4,
    zone: 'strong_base',
    explanation: 'O hidróxido de cálcio é uma base forte de metal alcalino-terroso, com solução saturada em pH ~12,4.',
  },
];

export const NEUTRALIZATION_BANK: NeutralizationItem[] = [
  {
    id: 'neu-1',
    leftParts: ['HCl', 'NaOH'],
    rightParts: ['?', 'H2O'],
    missingPosition: 'salt',
    correctAnswer: 'NaCl',
    options: ['NaCl', 'NaH', 'NaClO', 'HNa'],
    explanation: 'O cátion Na⁺ da base une-se ao ânion Cl⁻ do ácido formando cloreto de sódio (NaCl) e água.',
    fullEquation: 'HCl + NaOH → NaCl + H₂O',
  },
  {
    id: 'neu-2',
    leftParts: ['HNO3', 'KOH'],
    rightParts: ['?', 'H2O'],
    missingPosition: 'salt',
    correctAnswer: 'KNO3',
    options: ['KNO3', 'K2NO3', 'KNO2', 'KH'],
    explanation: 'O cátion K⁺ (carga +1) combina-se com o ânion nitrato NO₃⁻ (carga -1), originando KNO₃.',
    fullEquation: 'HNO₃ + KOH → KNO₃ + H₂O',
  },
  {
    id: 'neu-3',
    leftParts: ['H2SO4', 'Ca(OH)2'],
    rightParts: ['?', '2H2O'],
    missingPosition: 'salt',
    correctAnswer: 'CaSO4',
    options: ['CaSO4', 'Ca2SO4', 'Ca(SO4)2', 'CaS'],
    explanation: 'Como Ca²⁺ tem carga +2 e SO₄²⁻ tem carga -2, a proporção é 1:1 formando sulfato de cálcio (CaSO₄).',
    fullEquation: 'H₂SO₄ + Ca(OH)₂ → CaSO₄ + 2H₂O',
  },
  {
    id: 'neu-4',
    leftParts: ['?', '2NaOH'],
    rightParts: ['Na2SO4', '2H2O'],
    missingPosition: 'acid',
    correctAnswer: 'H2SO4',
    options: ['H2SO4', 'HCl', 'HNO3', 'H2S'],
    explanation: 'Para formar o ânion sulfato (SO₄²⁻) e neutralizar 2 OH⁻, o ácido reagente precisa ser o H₂SO₄.',
    fullEquation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
  },
  {
    id: 'neu-5',
    leftParts: ['2HCl', '?'],
    rightParts: ['CaCl2', '2H2O'],
    missingPosition: 'base',
    correctAnswer: 'Ca(OH)2',
    options: ['Ca(OH)2', 'CaOH', 'NaOH', 'Al(OH)3'],
    explanation: 'O sal CaCl₂ fornece o cátion Ca²⁺, que vem da base hidróxido de cálcio: Ca(OH)₂.',
    fullEquation: '2HCl + Ca(OH)₂ → CaCl₂ + 2H₂O',
  },
  {
    id: 'neu-6',
    leftParts: ['H3PO4', '3NaOH'],
    rightParts: ['?', '3H2O'],
    missingPosition: 'salt',
    correctAnswer: 'Na3PO4',
    options: ['Na3PO4', 'NaPO4', 'Na2PO4', 'Na3P'],
    explanation: 'Três cátions Na⁺ (+1) neutralizam um ânion fosfato PO₄³⁻ (-3), formando Na₃PO₄.',
    fullEquation: 'H₃PO₄ + 3NaOH → Na₃PO₄ + 3H₂O',
  },
  {
    id: 'neu-7',
    leftParts: ['?', 'NH4OH'],
    rightParts: ['NH4NO3', 'H2O'],
    missingPosition: 'acid',
    correctAnswer: 'HNO3',
    options: ['HNO3', 'H2SO4', 'HCl', 'HCN'],
    explanation: 'O ânion nitrato (NO₃⁻) presente no sal NH₄NO₃ provém do ácido nítrico (HNO₃).',
    fullEquation: 'HNO₃ + NH₄OH → NH₄NO₃ + H₂O',
  },
  {
    id: 'neu-8',
    leftParts: ['2HNO3', '?'],
    rightParts: ['Mg(NO3)2', '2H2O'],
    missingPosition: 'base',
    correctAnswer: 'Mg(OH)2',
    options: ['Mg(OH)2', 'MgOH', 'KOH', 'Ba(OH)2'],
    explanation: 'O cátion Mg²⁺ do sal nitrato de magnésio vem da base Mg(OH)₂, que libera 2 OH⁻.',
    fullEquation: '2HNO₃ + Mg(OH)₂ → Mg(NO₃)₂ + 2H₂O',
  },
  {
    id: 'neu-9',
    leftParts: ['H2CO3', 'Ca(OH)2'],
    rightParts: ['?', '2H2O'],
    missingPosition: 'salt',
    correctAnswer: 'CaCO3',
    options: ['CaCO3', 'Ca2CO3', 'Ca(HCO3)2', 'CaC'],
    explanation: 'O cátion Ca²⁺ une-se ao ânion carbonato CO₃²⁻ formando carbonato de cálcio (CaCO₃).',
    fullEquation: 'H₂CO₃ + Ca(OH)₂ → CaCO₃ + 2H₂O',
  },
  {
    id: 'neu-10',
    leftParts: ['?', 'NH4OH'],
    rightParts: ['NH4Cl', 'H2O'],
    missingPosition: 'acid',
    correctAnswer: 'HCl',
    options: ['HCl', 'HClO', 'HNO3', 'HBr'],
    explanation: 'O ânion cloreto (Cl⁻) do sal cloreto de amônio origina-se do ácido clorídrico (HCl).',
    fullEquation: 'HCl + NH₄OH → NH₄Cl + H₂O',
  },
  {
    id: 'neu-11',
    leftParts: ['H2SO4', '?'],
    rightParts: ['BaSO4', '2H2O'],
    missingPosition: 'base',
    correctAnswer: 'Ba(OH)2',
    options: ['Ba(OH)2', 'BaOH', 'Ca(OH)2', 'Fe(OH)3'],
    explanation: 'Para formar sulfato de bário (BaSO₄), o ácido sulfúrico reage com hidróxido de bário, Ba(OH)₂.',
    fullEquation: 'H₂SO₄ + Ba(OH)₂ → BaSO₄ + 2H₂O',
  },
  {
    id: 'neu-12',
    leftParts: ['HBr', 'KOH'],
    rightParts: ['?', 'H2O'],
    missingPosition: 'salt',
    correctAnswer: 'KBr',
    options: ['KBr', 'KBrO', 'K2Br', 'BrOH'],
    explanation: 'O cátion K⁺ combina-se com o ânion brometo Br⁻ formando brometo de potássio (KBr) e água.',
    fullEquation: 'HBr + KOH → KBr + H₂O',
  },
];

export function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface SampleCompoundOptions {
  excludeIds?: Set<string>;
  excludeAmmonium?: boolean;
  excludePeroxides?: boolean;
}

export function sampleBalancedCompounds(
  count: number,
  optionsOrExclude?: Set<string> | SampleCompoundOptions
): CompoundItem[] {
  const opts: SampleCompoundOptions =
    optionsOrExclude instanceof Set
      ? { excludeIds: optionsOrExclude }
      : optionsOrExclude ?? {};

  const excludeIds = opts.excludeIds ?? new Set<string>();
  const basePool = COMPOUNDS_BANK.filter((c) => {
    if (opts.excludeAmmonium && c.hasAmmonium) return false;
    if (opts.excludePeroxides && c.isPeroxideOrSuperoxide) return false;
    return true;
  });

  const byFunc: Record<ChemFunction, CompoundItem[]> = {
    acid: shuffleArray(basePool.filter((c) => c.func === 'acid' && !excludeIds.has(c.id))),
    base: shuffleArray(basePool.filter((c) => c.func === 'base' && !excludeIds.has(c.id))),
    salt: shuffleArray(basePool.filter((c) => c.func === 'salt' && !excludeIds.has(c.id))),
    oxide: shuffleArray(basePool.filter((c) => c.func === 'oxide' && !excludeIds.has(c.id))),
  };

  // Fallback if exclusions exhausted any function
  const fallbackByFunc: Record<ChemFunction, CompoundItem[]> = {
    acid: shuffleArray(basePool.filter((c) => c.func === 'acid')),
    base: shuffleArray(basePool.filter((c) => c.func === 'base')),
    salt: shuffleArray(basePool.filter((c) => c.func === 'salt')),
    oxide: shuffleArray(basePool.filter((c) => c.func === 'oxide')),
  };

  const funcs: ChemFunction[] = shuffleArray(['acid', 'base', 'salt', 'oxide']);
  const picked: CompoundItem[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < count; i++) {
    const fn = funcs[i % 4];
    let candidate = byFunc[fn].find((c) => !usedIds.has(c.id));
    if (!candidate) {
      candidate = fallbackByFunc[fn].find((c) => !usedIds.has(c.id));
    }
    if (candidate) {
      picked.push(candidate);
      usedIds.add(candidate.id);
    }
  }

  return shuffleArray(picked);
}
