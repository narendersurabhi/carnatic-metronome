import { JATIS, buildSaptaTalaMockData } from '../domain/tala';
import { SaptaTala, TalaTemplate } from '../domain/models';

export const saptaTalasMock: SaptaTala[] = buildSaptaTalaMockData('CHATURASRA');

export const jatiOptionsMock = [...JATIS];

export const defaultTemplate: TalaTemplate = {
  id: 'tmpl-1',
  name: 'Practice Varnam Slow',
  blocks: [
    { id: 'b1', angaType: 'LAGHU', jatiCount: 4 },
    { id: 'b2', angaType: 'DHRUTAM' },
    { id: 'b3', angaType: 'DHRUTAM' }
  ]
};
