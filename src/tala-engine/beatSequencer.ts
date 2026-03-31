import { getTalaDefinition } from './talaDefinitions';
import { resolveAccent } from './accentLogic';
import { AngaType, Beat, BeatSequence, JATIS, JatiType, TalaType } from './types';

const JATI_COUNTS: Record<JatiType, number> = {
  TISRA: 3,
  CHATURASRA: 4,
  KHANDA: 5,
  MISRA: 7,
  SANKEERNA: 9
};

export const getLaghuCount = (jati: JatiType): number => JATI_COUNTS[jati];

export const getAngaBeatCount = (angaType: AngaType, jati: JatiType): number => {
  if (angaType === 'LAGHU') return getLaghuCount(jati);
  if (angaType === 'DRUTAM') return 2;
  return 1;
};

export const listSupportedJatis = (): readonly JatiType[] => JATIS;

export const buildBeatSequence = (tala: TalaType, jati: JatiType): BeatSequence => {
  const talaDefinition = getTalaDefinition(tala);
  const beats: Beat[] = [];

  talaDefinition.angaPattern.forEach((angaType, angaIndex) => {
    const angaBeatCount = getAngaBeatCount(angaType, jati);

    for (let angaBeatIndex = 0; angaBeatIndex < angaBeatCount; angaBeatIndex += 1) {
      const cycleBeatIndex = beats.length;
      beats.push({
        tala,
        jati,
        cycleBeatIndex,
        angaIndex,
        angaType,
        angaBeatIndex,
        accent: resolveAccent({ cycleBeatIndex, angaBeatIndex, angaType }),
        isSamam: cycleBeatIndex === 0
      });
    }
  });

  return { tala, jati, totalBeats: beats.length, beats };
};
