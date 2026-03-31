import { AngaType, Jati, JatiType, LaghuJatiCount, SaptaTala, TalaDefinition, TemplateBlock } from './models';

const SUBSCRIPT_NUMERALS: Record<LaghuJatiCount, string> = {
  3: '₃',
  4: '₄',
  5: '₅',
  7: '₇',
  9: '₉'
};

export const JATIS: readonly Jati[] = [
  { id: 'TISRA', name: 'Tisra', count: 3, description: 'A triplet-based pulse of 3 units. Driving and energetic.' },
  { id: 'CHATURASRA', name: 'Chaturasra', count: 4, description: 'The standard pulse of 4 units. Fundamental and balanced.' },
  { id: 'KHANDA', name: 'Khanda', count: 5, description: 'A complex pulse of 5 units. Intricate and sophisticated.' },
  { id: 'MISRA', name: 'Misra', count: 7, description: 'A flowing pulse of 7 units. Rhythmic and cyclical.' },
  { id: 'SANKEERNA', name: 'Sankeerna', count: 9, description: 'The complex pulse of 9 units. Advanced mathematical depth.' }
] as const;

export const SAPTA_TALA_DEFINITIONS: readonly TalaDefinition[] = [
  { id: 'dhruva', name: 'Dhruva', angaPattern: ['LAGHU', 'DHRUTAM', 'LAGHU', 'LAGHU'] },
  { id: 'matya', name: 'Matya', angaPattern: ['LAGHU', 'DHRUTAM', 'LAGHU'] },
  { id: 'rupaka', name: 'Rupaka', angaPattern: ['DHRUTAM', 'LAGHU'] },
  { id: 'jhampa', name: 'Jhampa', angaPattern: ['LAGHU', 'ANUDHRUTAM', 'DHRUTAM'] },
  { id: 'triputa-aadi', name: 'Triputa (Aadi)', angaPattern: ['LAGHU', 'DHRUTAM', 'DHRUTAM'] },
  { id: 'ata', name: 'Ata', angaPattern: ['LAGHU', 'LAGHU', 'DHRUTAM', 'DHRUTAM'] },
  { id: 'eka', name: 'Eka', angaPattern: ['LAGHU'] }
] as const;

export const getLaghuBeatCount = (jati: JatiType | LaghuJatiCount): LaghuJatiCount => {
  if (typeof jati === 'number') {
    return jati;
  }

  const matchingJati = JATIS.find((item) => item.id === jati);
  if (!matchingJati) {
    return 4;
  }

  return matchingJati.count;
};

export const getAngaBeatCount = (angaType: AngaType, jati: JatiType | LaghuJatiCount = 'CHATURASRA'): number => {
  if (angaType === 'LAGHU') {
    return getLaghuBeatCount(jati);
  }

  if (angaType === 'DHRUTAM') {
    return 2;
  }

  return 1;
};

export const computeTemplateAksharas = (blocks: TemplateBlock[], defaultJati: JatiType | LaghuJatiCount = 'CHATURASRA'): number => {
  return blocks.reduce((sum, block) => {
    return sum + getAngaBeatCount(block.angaType, block.jatiCount ?? defaultJati);
  }, 0);
};

export const generateAngaLabels = (
  angaPattern: readonly AngaType[] | TemplateBlock[],
  defaultJati: JatiType | LaghuJatiCount = 'CHATURASRA'
): string[] => {
  return angaPattern.map((item) => {
    const angaType = typeof item === 'string' ? item : item.angaType;
    const jati = typeof item === 'string' ? defaultJati : item.jatiCount ?? defaultJati;

    if (angaType === 'LAGHU') {
      const laghuCount = getLaghuBeatCount(jati);
      return `I${SUBSCRIPT_NUMERALS[laghuCount]}`;
    }

    if (angaType === 'DHRUTAM') {
      return 'O';
    }

    return 'U';
  });
};

export const buildSaptaTalaMockData = (defaultJati: JatiType | LaghuJatiCount = 'CHATURASRA'): SaptaTala[] => {
  return SAPTA_TALA_DEFINITIONS.map((tala) => {
    const blocks: TemplateBlock[] = tala.angaPattern.map((angaType, index) => ({
      id: `${tala.id}-${index + 1}`,
      angaType,
      jatiCount: angaType === 'LAGHU' ? getLaghuBeatCount(defaultJati) : undefined
    }));

    return {
      ...tala,
      angaLabels: generateAngaLabels(tala.angaPattern, defaultJati),
      aksharas: computeTemplateAksharas(blocks, defaultJati)
    };
  });
};
