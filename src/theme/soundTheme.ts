export const soundColors = {
  background: '#17130f',
  surface: '#1c1b1b',
  surfaceElevated: '#231f1b',
  surfaceBright: '#39342f',
  textPrimary: '#eae1da',
  textMuted: '#d0c5af',
  gold: '#D4AF37',
  goldBright: '#f2ca50',
  goldSoft: 'rgba(212,175,55,0.2)',
  border: 'rgba(212,175,55,0.15)',
  borderStrong: 'rgba(212,175,55,0.45)',
  keyIvoryTop: '#f9f5f0',
  keyIvoryBottom: '#e8decb',
  keyWoodTop: '#3d2b1f',
  keyWoodBottom: '#2a1d15'
} as const;

export const soundSpacing = {
  pageX: 24,
  sectionGap: 34,
  cardGap: 12
} as const;

export const soundTypography = {
  heroOverline: { fontSize: 11, letterSpacing: 4, fontWeight: '600' as const, textTransform: 'uppercase' as const },
  heroTitle: { fontSize: 42, fontWeight: '700' as const },
  sectionTitle: { fontSize: 28, fontWeight: '600' as const },
  cardTitle: { fontSize: 22, fontWeight: '500' as const },
  labelTiny: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const }
} as const;
