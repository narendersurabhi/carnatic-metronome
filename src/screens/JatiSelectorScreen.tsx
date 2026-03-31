import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '../components/jati/BottomNav';
import { CloseButton } from '../components/jati/CloseButton';
import { JatiOption, JatiOptionCard } from '../components/jati/JatiOptionCard';
import { JatiSelectionHeader } from '../components/jati/JatiSelectionHeader';
import { TalasTopBar } from '../components/talas/TalasTopBar';
import { jatiColors } from '../theme/jatiTheme';

const OPTIONS: JatiOption[] = [
  { id: 'TISRA', name: 'Tisra', description: 'A triplet-based pulse of 3 units. Driving and energetic.', count: 3 },
  { id: 'CHATURASRA', name: 'Chaturasra', description: 'The standard pulse of 4 units. Fundamental and balanced.', count: 4 },
  { id: 'KHANDA', name: 'Khanda', description: 'A complex pulse of 5 units. Intricate and sophisticated.', count: 5 },
  { id: 'MISRA', name: 'Misra', description: 'A flowing pulse of 7 units. Rhythmic and cyclical.', count: 7 },
  { id: 'SANKEERNA', name: 'Sankeerna', description: 'The complex pulse of 9 units. Advanced mathematical depth.', count: 9 }
];

export const JatiSelectorScreen = () => {
  const [selectedId, setSelectedId] = useState('CHATURASRA');

  return (
    <SafeAreaView style={styles.safe}>
      <TalasTopBar />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <JatiSelectionHeader />

        <View style={styles.list}>
          {OPTIONS.map((option) => (
            <JatiOptionCard
              key={option.id}
              option={option}
              active={selectedId === option.id}
              onPress={() => setSelectedId(option.id)}
            />
          ))}
        </View>

        <View style={styles.closeWrap}>
          <CloseButton onPress={() => {}} />
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: jatiColors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 120 },
  list: { gap: 18 },
  closeWrap: { marginTop: 44, alignItems: 'center' }
});
