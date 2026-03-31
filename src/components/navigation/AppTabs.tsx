import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { PlayerScreen } from '../../features/player/PlayerScreen';
import { TalaSelectionScreen } from '../../features/tala/TalaSelectionScreen';
import { TemplateBuilderScreen } from '../../features/templates/TemplateBuilderScreen';
import { SoundAndSruthiScreen } from '../../features/settings/SoundAndSruthiScreen';

export type AppTabParamList = {
  Player: undefined;
  Talas: undefined;
  Templates: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
    <Tab.Screen name="Player" component={PlayerScreen} />
    <Tab.Screen name="Talas" component={TalaSelectionScreen} />
    <Tab.Screen name="Templates" component={TemplateBuilderScreen} />
    <Tab.Screen name="Settings" component={SoundAndSruthiScreen} />
  </Tab.Navigator>
);
