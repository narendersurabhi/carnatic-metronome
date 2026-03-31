import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TopBar } from '../../components/common/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { JatiOptionCard } from '../../components/tala/JatiOptionCard';
import { useAppStore } from '../../state/appStore';
import { colors } from '../../theme/tokens';
import { jatiOptionsMock } from '../../state/mockData';

export const JatiSelectionScreen = () => {
  const navigation = useNavigation();
  const { selectedJati, setField } = useAppStore();
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('TalaSelection' as never);
  };

  return <View style={styles.screen}><TopBar /><ScrollView contentContainerStyle={styles.content}><Text style={styles.eyebrow}>Mathematical Foundation</Text><Text style={styles.title}>Select Jati</Text><Text style={styles.subtitle}>Choose the rhythmic pulse that defines the number of aksharas per beat.</Text><Text style={styles.backToTalas} onPress={handleBack}>← Back to Talas</Text><View style={styles.list}>{jatiOptionsMock.map((o) => <JatiOptionCard key={o.id} name={o.name} desc={o.description} count={o.count} active={selectedJati === o.id} onPress={() => setField('selectedJati', o.id)} />)}</View><Text style={styles.close} onPress={handleBack}>Cancel & Close</Text></ScrollView><BottomNav active="Talas" /></View>;
};

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, gap: 16, paddingBottom: 100 }, eyebrow: { color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' }, title: { color: colors.text, fontSize: 46, fontWeight: '700', textAlign: 'center' }, subtitle: { color: colors.textMuted, textAlign: 'center' }, backToTalas: { color: colors.gold, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 12 }, list: { gap: 12 }, close: { color: colors.textMuted, textAlign: 'center', marginTop: 20, textTransform: 'uppercase', letterSpacing: 1.5 } });
