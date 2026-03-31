import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { talasColors } from '../../theme/talasTheme';
import { AngaBadge } from './AngaBadge';

export interface TalaSummary {
  id: string;
  name: string;
  aksharas: number;
  angaCount: number;
  badges: string[];
  extra?: string;
}

interface Props {
  item: TalaSummary;
  selected: boolean;
  onPress: () => void;
}

export const TalaListItem = ({ item, selected, onPress }: Props) => {
  return (
    <Pressable style={[styles.row, selected ? styles.rowSelected : styles.rowIdle]} onPress={onPress}>
      {selected ? <View style={styles.leftAccent} /> : null}
      <View style={styles.left}>
        <Text style={[styles.title, selected && styles.titleSel]}>{item.name}</Text>
        <Text style={[styles.meta, selected && styles.metaSel]}>
          {item.aksharas} Aksharas • {item.angaCount} Angas{item.extra ? ` • ${item.extra}` : ''}
        </Text>
      </View>

      <View style={styles.right}>
        <View style={styles.badges}>{item.badges.map((b, idx) => <AngaBadge key={`${b}-${idx}`} label={b} highlighted={selected && idx === 0} />)}</View>
        <Text style={[styles.chev, selected && styles.chevSel]}>{selected ? '✓' : '›'}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: { minHeight: 90, borderRadius: 4, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'relative' },
  rowIdle: { backgroundColor: talasColors.surface },
  rowSelected: { backgroundColor: talasColors.surfaceLow },
  leftAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: talasColors.gold },
  left: { flex: 1, paddingRight: 12 },
  title: { color: talasColors.textPrimary, fontSize: 33, marginBottom: 3 },
  titleSel: { color: talasColors.gold },
  meta: { color: talasColors.textVariant, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 },
  metaSel: { color: talasColors.gold, fontWeight: '700' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badges: { flexDirection: 'row', gap: 8 },
  chev: { color: talasColors.textVariant, fontSize: 26 },
  chevSel: { color: talasColors.gold }
});
