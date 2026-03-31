import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { TopBar } from '../../components/common/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { SearchBar } from '../../components/common/SearchBar';
import { AngaBadge } from '../../components/tala/AngaBadge';
import { colors } from '../../theme/tokens';
import { useAppStore } from '../../state/appStore';
import { SAPTA_TALA_DEFINITIONS, computeTemplateAksharas, generateAngaLabels, getLaghuBeatCount } from '../../domain/tala';

export const TalaSelectionScreen = () => {
  const [query, setQuery] = useState('');
  const navigation = useNavigation();
  const { selectedTala, selectedJati, setField } = useAppStore();

  const items = useMemo(
    () =>
      SAPTA_TALA_DEFINITIONS
        .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
        .map((tala) => {
          const blocks = tala.angaPattern.map((angaType, index) => ({
            id: `${tala.id}-${index + 1}`,
            angaType,
            jatiCount: angaType === 'LAGHU' ? getLaghuBeatCount(selectedJati) : undefined
          }));

          return {
            ...tala,
            angaLabels: generateAngaLabels(tala.angaPattern, selectedJati),
            aksharas: computeTemplateAksharas(blocks, selectedJati)
          };
        }),
    [query, selectedJati]
  );

  return (
    <View style={styles.screen}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sapta Talas</Text>
        <SearchBar value={query} onChange={setQuery} />
        <Text style={styles.jatiCta} onPress={() => navigation.navigate('JatiSelection' as never)}>
          Current Jati: {selectedJati} • Tap to Change
        </Text>
        {items.map((t) => {
          const active = t.id === selectedTala;
          return (
            <View key={t.id} style={[styles.row, active && styles.rowActive]}>
              <View style={styles.left}>
                <Text style={[styles.name, active && styles.nameActive]}>{t.name}</Text>
                <Text style={[styles.meta, active && styles.metaActive]}>
                  {t.aksharas} Aksharas • {t.angaPattern.length} Angas
                </Text>
              </View>
              <View style={styles.badges}>
                {t.angaLabels.map((a, idx) => (
                  <AngaBadge key={`${t.id}-${idx}`} label={a} active={active && idx === 0} />
                ))}
                <Text style={[styles.chev, active && styles.nameActive]} onPress={() => setField('selectedTala', t.id)}>
                  {active ? '✓' : '›'}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <BottomNav active="Talas" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, gap: 14, paddingBottom: 100 },
  title: { color: colors.text, fontSize: 42 },
  jatiCta: {
    color: colors.gold,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  row: {
    backgroundColor: colors.background,
    borderRadius: 4,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowActive: { backgroundColor: colors.surfaceLow, borderLeftWidth: 4, borderLeftColor: colors.gold },
  left: { flex: 1 },
  name: { color: colors.text, fontSize: 32 },
  nameActive: { color: colors.gold },
  meta: { color: colors.textMuted, fontSize: 11, textTransform: 'uppercase' },
  metaActive: { color: colors.gold },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chev: { color: colors.textMuted, fontSize: 24 }
});
