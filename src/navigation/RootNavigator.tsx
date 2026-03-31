import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PlayerScreen } from '../screens/PlayerScreen';
import { TalaSelectorScreen } from '../screens/TalaSelectorScreen';
import { JatiSelectorScreen } from '../screens/JatiSelectorScreen';
import { InstrumentSelectorScreen } from '../screens/InstrumentSelectorScreen';
import { SoundSruthiScreen } from '../screens/SoundSruthiScreen';
import { TemplateBuilderScreen } from '../screens/TemplateBuilderScreen';

export type RootStackParamList = {
  PlayerScreen: undefined;
  TalaSelector: undefined;
  JatiSelector: undefined;
  InstrumentSelector: undefined;
  SoundSruthi: undefined;
  TemplateBuilder: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="PlayerScreen">
      <Stack.Screen name="PlayerScreen" component={PlayerScreen} options={{ title: 'Player' }} />
      <Stack.Screen name="TalaSelector" component={TalaSelectorScreen} options={{ title: 'Select Tala' }} />
      <Stack.Screen name="JatiSelector" component={JatiSelectorScreen} options={{ title: 'Select Jati' }} />
      <Stack.Screen name="InstrumentSelector" component={InstrumentSelectorScreen} options={{ title: 'Select Instrument' }} />
      <Stack.Screen name="SoundSruthi" component={SoundSruthiScreen} options={{ title: 'Sound & Sruthi' }} />
      <Stack.Screen name="TemplateBuilder" component={TemplateBuilderScreen} options={{ title: 'Template Builder' }} />
    </Stack.Navigator>
  );
};
