import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { AppTabs } from './src/components/navigation/AppTabs';
import { colors } from './src/theme/tokens';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.outline,
    primary: colors.gold
  }
};

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <AppTabs />
    </NavigationContainer>
  );
}
