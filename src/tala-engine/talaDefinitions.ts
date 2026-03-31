import { TalaDefinition, TalaType } from './types';

const DEFINITIONS: Record<TalaType, TalaDefinition> = {
  DHRUVA: { tala: 'DHRUVA', label: 'Dhruva', angaPattern: ['LAGHU', 'DRUTAM', 'LAGHU', 'LAGHU'] },
  MATYA: { tala: 'MATYA', label: 'Matya', angaPattern: ['LAGHU', 'DRUTAM', 'LAGHU'] },
  JHAMPA: { tala: 'JHAMPA', label: 'Jhampa', angaPattern: ['LAGHU', 'ANUDRUTAM', 'DRUTAM'] },
  ATA: { tala: 'ATA', label: 'Ata', angaPattern: ['LAGHU', 'LAGHU', 'DRUTAM', 'DRUTAM'] },
  EKA: { tala: 'EKA', label: 'Eka', angaPattern: ['LAGHU'] },
  AADI: { tala: 'AADI', label: 'Aadi', angaPattern: ['LAGHU', 'DRUTAM', 'DRUTAM'] },
  RUPAKA: { tala: 'RUPAKA', label: 'Rupaka', angaPattern: ['DRUTAM', 'LAGHU'] }
};

export const getTalaDefinition = (tala: TalaType): TalaDefinition => DEFINITIONS[tala];
