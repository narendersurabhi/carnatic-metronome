import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TopBar } from '../../components/common/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { JatiOptionCard } from '../../components/tala/JatiOptionCard';
import { useAppStore } from '../../state/appStore';
import { colors } from '../../theme/tokens';

const options = [
  { id: 'TISRA', name: 'Tisra', count: 3, desc: 'A triplet-based pulse of 3 units. Driving and energetic.' },
  { id: 'CHATURASRA', name: 'Chaturasra', count: 4, desc: 'The standard pulse of 4 units. Fundamental and balanced.' },
  { id: 'KHANDA', name: 'Khanda', count: 5, desc: 'A complex pulse of 5 units. Intricate and sophisticated.' },
  { id: 'MISRA', name: 'Misra', count: 7, desc: 'A flowing pulse of 7 units. Rhythmic and cyclical.' },
  { id: 'SANKEERNA', name: 'Sankeerna', count: 9, desc: 'The complex pulse of 9 units. Advanced mathematical depth.' }
] as const;

export const JatiSelectionScreen = () => {
  const { selectedJati, setField } = useAppStore();
  return <View style={styles.screen}><TopBar /><ScrollView contentContainerStyle={styles.content}><Text style={styles.eyebrow}>Mathematical Foundation</Text><Text style={styles.title}>Select Jati</Text><Text style={styles.subtitle}>Choose the rhythmic pulse that defines the number of aksharas per beat.</Text><View style={styles.list}>{options.map((o) => <JatiOptionCard key={o.id} name={o.name} desc={o.desc} count={o.count} active={selectedJati === o.id} onPress={() => setField('selectedJati', o.id)} />)}</View><Text style={styles.close}>Cancel & Close</Text></ScrollView><BottomNav active="Talas" /></View>;
};

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, gap: 16, paddingBottom: 100 }, eyebrow: { color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' }, title: { color: colors.text, fontSize: 46, fontWeight: '700', textAlign: 'center' }, subtitle: { color: colors.textMuted, textAlign: 'center' }, list: { gap: 12 }, close: { color: colors.textMuted, textAlign: 'center', marginTop: 20, textTransform: 'uppercase', letterSpacing: 1.5 } });
