import { JATIS, buildSaptaTalaMockData } from '../domain/tala';
import { PlayerSettings, SaptaTala, SoundSettings, TalaTemplate } from '../domain/models';

export const defaultPlayerSettings: PlayerSettings = {
  selectedTala: 'triputa-aadi',
  selectedJati: 'CHATURASRA',
  bpm: 84,
  selectedTemplateId: 'tmpl-1'
};

export const defaultSoundSettings: SoundSettings = {
  selectedInstrument: 'Mridangam',
  sruthi: 'C#',
  droneEnabled: true,
  metronomeGain: 82,
  droneGain: 45
};

export const saptaTalasMock: SaptaTala[] = buildSaptaTalaMockData(defaultPlayerSettings.selectedJati);

export const jatiOptionsMock = [...JATIS];

export const defaultTemplate: TalaTemplate = {
  id: defaultPlayerSettings.selectedTemplateId,
  name: 'Practice Varnam Slow',
  blocks: [
    { id: 'b1', angaType: 'LAGHU', jatiCount: 4 },
    { id: 'b2', angaType: 'DHRUTAM' },
    { id: 'b3', angaType: 'DHRUTAM' }
  ]
};
