import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '../components/talas/BottomNav';
import { InsightCard } from '../components/talas/InsightCard';
import { PromoCard } from '../components/talas/PromoCard';
import { SearchBar } from '../components/talas/SearchBar';
import { TalaListItem, TalaSummary } from '../components/talas/TalaListItem';
import { TalasTopBar } from '../components/talas/TalasTopBar';
import { talasColors, talasTypography } from '../theme/talasTheme';

const TALAS: TalaSummary[] = [
  { id: 'dhruva', name: 'Dhruva', aksharas: 14, angaCount: 4, badges: ['I₄', 'O', 'I₄', 'I₄'] },
  { id: 'matya', name: 'Matya', aksharas: 10, angaCount: 3, badges: ['I₄', 'O', 'I₄'] },
  { id: 'rupaka', name: 'Rupaka', aksharas: 6, angaCount: 2, badges: ['O', 'I₄'] },
  { id: 'jhampa', name: 'Jhampa', aksharas: 10, angaCount: 3, badges: ['I₇', 'U', 'O'] },
  { id: 'triputa-aadi', name: 'Triputa (Aadi)', aksharas: 8, angaCount: 3, badges: ['I₄', 'O', 'O'], extra: 'Chaturasra' },
  { id: 'ata', name: 'Ata', aksharas: 14, angaCount: 4, badges: ['I₅', 'I₅', 'O', 'O'] },
  { id: 'eka', name: 'Eka', aksharas: 4, angaCount: 1, badges: ['I₄'] }
];

export const TalaSelectorScreen = () => {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('triputa-aadi');

  const filtered = useMemo(() => TALAS.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <SafeAreaView style={styles.safe}>
      <TalasTopBar />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Sapta Talas</Text>
          <SearchBar value={query} onChange={setQuery} />
        </View>

        <View style={styles.listWrap}>
          {filtered.map((item) => (
            <TalaListItem key={item.id} item={item} selected={item.id === selectedId} onPress={() => setSelectedId(item.id)} />
          ))}
        </View>

        <View style={styles.cardsRow}>
          <InsightCard
            title="Mastery Tip"
            body="Focus on the transition between Laghu and Dhrutam for precise Aadi Tala performance."
          />
          <PromoCard />
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: talasColors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120, gap: 24 },
  header: { gap: 18 },
  title: { ...talasTypography.title, color: talasColors.textPrimary },
  listWrap: { gap: 14 },
  cardsRow: { flexDirection: 'row', gap: 12 }
});
