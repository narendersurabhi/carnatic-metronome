import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';

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

// Workaround for native header prop mismatch (`onAttached`) seen on some Expo/React Navigation runtime combos.
// Disabling native screens falls back to JS-based screens and prevents ScreenStackHeaderConfig crashes.
enableScreens(false);

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <AppTabs />
    </NavigationContainer>
  );
}
