export const zenColors = {
  background: '#131313',
  surface: '#1c1b1b',
  surfaceHigh: '#2a2a2a',
  textPrimary: '#e5e2e1',
  textMuted: 'rgba(229,226,225,0.4)',
  textSubtle: 'rgba(229,226,225,0.3)',
  gold: '#e9c176',
  goldDim: 'rgba(233,193,118,0.55)',
  goldSoft: 'rgba(233,193,118,0.2)',
  outline: '#4e4639',
  whiteLow: 'rgba(255,255,255,0.1)'
} as const;

export const zenTypography = {
  jatiLabel: {
    fontSize: 10,
    letterSpacing: 4,
    textTransform: 'uppercase' as const,
    fontWeight: '500' as const
  },
  talaTitle: {
    fontSize: 40,
    fontWeight: '300' as const,
    letterSpacing: -0.5
  },
  chip: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    fontWeight: '500' as const
  },
  beatDisplay: {
    fontSize: 150,
    fontWeight: '700' as const,
    letterSpacing: -4,
    lineHeight: 160
  }
};
