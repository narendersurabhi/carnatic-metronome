import {
  AngaBoundary,
  AngaType,
  DerivedBeat,
  DerivedTalaCycle,
  Jati,
  JatiType,
  LaghuJatiCount,
  PlayerSummaryState,
  SaptaTala,
  TalaCycleSummary,
  TalaDefinition,
  TalaTemplate,
  TemplateBlock
} from './models';

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

const toAngaLabel = (angaType: AngaType, jati: JatiType | LaghuJatiCount): string => {
  if (angaType === 'LAGHU') {
    return `I${SUBSCRIPT_NUMERALS[getLaghuBeatCount(jati)]}`;
  }
  if (angaType === 'DHRUTAM') {
    return 'O';
  }
  return 'U';
};

const deriveFromAngaPattern = (
  angaPattern: readonly AngaType[],
  jati: JatiType,
  source: DerivedTalaCycle['source']
): DerivedTalaCycle => {
  const beats: DerivedBeat[] = [];
  const angaBoundaries: AngaBoundary[] = [];

  angaPattern.forEach((angaType, angaIndex) => {
    const startBeat = beats.length + 1;
    const beatCount = getAngaBeatCount(angaType, jati);
    const label = toAngaLabel(angaType, jati);

    for (let angaBeatIndex = 0; angaBeatIndex < beatCount; angaBeatIndex += 1) {
      const displayNumber = beats.length + 1;
      beats.push({
        index: beats.length,
        displayNumber,
        angaIndex,
        angaType,
        angaBeatIndex,
        angaLabel: label,
        isSamam: displayNumber === 1
      });
    }

    angaBoundaries.push({
      angaIndex,
      angaType,
      label,
      startBeat,
      endBeat: startBeat + beatCount - 1,
      beatCount
    });
  });

  return {
    source,
    beats,
    totalAksharas: beats.length,
    angaBoundaries
  };
};

export const deriveCycleFromSaptaTala = (talaId: string, jati: JatiType): DerivedTalaCycle => {
  const tala = SAPTA_TALA_DEFINITIONS.find((definition) => definition.id === talaId) ?? SAPTA_TALA_DEFINITIONS[0];
  return deriveFromAngaPattern(tala.angaPattern, jati, 'sapta-tala');
};

export const deriveCycleFromTemplate = (template: TalaTemplate, fallbackJati: JatiType): DerivedTalaCycle => {
  const beats: DerivedBeat[] = [];
  const angaBoundaries: AngaBoundary[] = [];

  template.blocks.forEach((block, angaIndex) => {
    const resolvedJati = block.jatiCount ?? fallbackJati;
    const startBeat = beats.length + 1;
    const beatCount = getAngaBeatCount(block.angaType, resolvedJati);
    const label = toAngaLabel(block.angaType, resolvedJati);

    for (let angaBeatIndex = 0; angaBeatIndex < beatCount; angaBeatIndex += 1) {
      const displayNumber = beats.length + 1;
      beats.push({
        index: beats.length,
        displayNumber,
        angaIndex,
        angaType: block.angaType,
        angaBeatIndex,
        angaLabel: label,
        isSamam: displayNumber === 1
      });
    }

    angaBoundaries.push({
      angaIndex,
      angaType: block.angaType,
      label,
      startBeat,
      endBeat: startBeat + beatCount - 1,
      beatCount
    });
  });

  return {
    source: 'template',
    beats,
    totalAksharas: computeTemplateAksharas(template.blocks, fallbackJati),
    angaBoundaries
  };
};

export const deriveOrderedBeatSequence = (params: {
  talaId: string;
  jati: JatiType;
  template?: TalaTemplate | null;
}): DerivedTalaCycle => {
  if (params.template && params.template.blocks.length > 0) {
    return deriveCycleFromTemplate(params.template, params.jati);
  }

  return deriveCycleFromSaptaTala(params.talaId, params.jati);
};

export const deriveActiveBeatDisplayNumber = (activeBeatIndex: number, totalAksharas: number): number => {
  if (totalAksharas <= 0) {
    return 1;
  }

  const normalized = activeBeatIndex % totalAksharas;
  return normalized <= 0 ? totalAksharas : normalized;
};

export const deriveCycleSummary = (params: {
  talaId: string;
  jati: JatiType;
  activeBeatIndex: number;
  template?: TalaTemplate | null;
}): TalaCycleSummary => {
  const cycle = deriveOrderedBeatSequence(params);
  const talaName = SAPTA_TALA_DEFINITIONS.find((tala) => tala.id === params.talaId)?.name ?? params.talaId;

  return {
    source: cycle.source,
    talaId: params.talaId,
    talaName,
    jati: params.jati,
    totalAksharas: cycle.totalAksharas,
    activeBeatDisplayNumber: deriveActiveBeatDisplayNumber(params.activeBeatIndex, Math.max(1, cycle.totalAksharas))
  };
};

export const getBeatIntervalMs = (bpm: number): number => {
  const safeBpm = Math.max(1, Math.round(bpm));
  return Math.round(60000 / safeBpm);
};

export const derivePlayerSummaryText = (state: PlayerSummaryState): string => {
  return [
    `${state.talaName} (${state.jatiName})`,
    `${state.bpm} BPM`,
    `${state.instrument}`,
    `Sruthi ${state.sruthi}`,
    `${state.templateName} · ${state.totalAksharas} aksharas`
  ].join(' • ');
};
