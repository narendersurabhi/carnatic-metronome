import { describe, expect, it } from 'vitest';

import { computeTemplateAksharas, generateAngaLabels, getAngaBeatCount, getLaghuBeatCount } from '../src/domain/tala';
import { jatiOptionsMock, saptaTalasMock } from '../src/state/mockData';

describe('domain tala helpers', () => {
  it('converts laghu + jati into beat counts', () => {
    expect(getLaghuBeatCount('TISRA')).toBe(3);
    expect(getLaghuBeatCount('CHATURASRA')).toBe(4);
    expect(getLaghuBeatCount('KHANDA')).toBe(5);
    expect(getLaghuBeatCount('MISRA')).toBe(7);
    expect(getLaghuBeatCount('SANKEERNA')).toBe(9);
  });

  it('computes anga beat count across anga types', () => {
    expect(getAngaBeatCount('LAGHU', 'MISRA')).toBe(7);
    expect(getAngaBeatCount('DHRUTAM', 'KHANDA')).toBe(2);
    expect(getAngaBeatCount('ANUDHRUTAM', 'SANKEERNA')).toBe(1);
  });

  it('computes total aksharas from template blocks', () => {
    expect(
      computeTemplateAksharas([
        { id: '1', angaType: 'LAGHU', jatiCount: 4 },
        { id: '2', angaType: 'DHRUTAM' },
        { id: '3', angaType: 'ANUDHRUTAM' }
      ])
    ).toBe(7);
  });

  it('generates anga labels for display', () => {
    expect(generateAngaLabels(['LAGHU', 'DHRUTAM', 'ANUDHRUTAM'], 'KHANDA')).toEqual(['I₅', 'O', 'U']);
    expect(
      generateAngaLabels([
        { id: 'a', angaType: 'LAGHU', jatiCount: 7 },
        { id: 'b', angaType: 'DHRUTAM' }
      ])
    ).toEqual(['I₇', 'O']);
  });
});

describe('mock data layer', () => {
  it('contains sapta talas and jati options', () => {
    expect(saptaTalasMock).toHaveLength(7);
    expect(jatiOptionsMock).toHaveLength(5);
  });

  it('provides precomputed anga labels and aksharas', () => {
    const aadi = saptaTalasMock.find((tala) => tala.id === 'triputa-aadi');
    expect(aadi?.angaLabels).toEqual(['I₄', 'O', 'O']);
    expect(aadi?.aksharas).toBe(8);
  });
});
