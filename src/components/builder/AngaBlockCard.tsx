import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { builderColors } from '../../theme/builderTheme';

export interface BlockPaletteItem {
  type: 'LAGHU' | 'DHRUTAM' | 'ANUDHRUTAM';
  title: string;
  description: string;
  accentColor: string;
}

interface Props {
  item: BlockPaletteItem;
  onAdd: (type: BlockPaletteItem['type']) => void;
}

export const AngaBlockCard = ({ item, onAdd }: Props) => (
  <Pressable style={[styles.card, { borderLeftColor: item.accentColor }]} onPress={() => onAdd(item.type)}>
    <View style={styles.row}><Text style={styles.title}>{item.title}</Text><Text style={styles.add}>＋</Text></View>
    <Text style={styles.desc}>{item.description}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: { backgroundColor: builderColors.surfaceHighest, borderLeftWidth: 2, borderRadius: 4, padding: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  title: { color: builderColors.textPrimary, fontSize: 24 },
  add: { color: '#9a8f80', fontSize: 16 },
  desc: { color: builderColors.textVariant, fontSize: 10, textTransform: 'uppercase' }
});
