import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PlayerScreen } from '../../features/player/PlayerScreen';
import { TalaSelectionScreen } from '../../features/tala/TalaSelectionScreen';
import { JatiSelectionScreen } from '../../features/tala/JatiSelectionScreen';
import { TemplateBuilderScreen } from '../../features/templates/TemplateBuilderScreen';
import { SoundAndSruthiScreen } from '../../features/settings/SoundAndSruthiScreen';

export type AppTabParamList = {
  Player: undefined;
  Talas: undefined;
  Templates: undefined;
  Settings: undefined;
};

export type TalaStackParamList = {
  TalaSelection: undefined;
  JatiSelection: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();
const TalasStack = createNativeStackNavigator<TalaStackParamList>();

const TalasNavigator = () => (
  <TalasStack.Navigator screenOptions={{ headerShown: false }}>
    <TalasStack.Screen name="TalaSelection" component={TalaSelectionScreen} />
    <TalasStack.Screen name="JatiSelection" component={JatiSelectionScreen} />
  </TalasStack.Navigator>
);

export const AppTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
    <Tab.Screen name="Player" component={PlayerScreen} />
    <Tab.Screen name="Talas" component={TalasNavigator} />
    <Tab.Screen name="Templates" component={TemplateBuilderScreen} />
    <Tab.Screen name="Settings" component={SoundAndSruthiScreen} />
  </Tab.Navigator>
);
