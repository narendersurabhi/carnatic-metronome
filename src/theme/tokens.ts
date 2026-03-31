export const colors = {
  background: '#131313',
  surface: '#201f1f',
  surfaceLow: '#1c1b1b',
  surfaceHigh: '#353534',
  text: '#e5e2e1',
  textMuted: '#d1c5b4',
  gold: '#e9c176',
  goldDark: '#c5a059',
  outline: '#4e4639',
  primaryContainer: '#c5a059'
} as const;

export const typography = {
  headline: { fontFamily: 'serif', fontWeight: '700' as const },
  body: { fontFamily: 'System', fontWeight: '400' as const },
  label: { fontFamily: 'System', fontWeight: '600' as const }
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const cardStyles = {
  base: { borderRadius: 4, backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: 'rgba(78,70,57,0.25)' },
  elevated: { backgroundColor: colors.surface }
};

export const buttonStyles = {
  primary: { backgroundColor: colors.gold },
  secondary: { backgroundColor: colors.surfaceHigh }
};

export const navStyles = {
  bar: { backgroundColor: 'rgba(19,19,19,0.88)' },
  active: colors.gold,
  inactive: colors.textMuted
};
