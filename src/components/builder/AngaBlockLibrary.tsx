import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { builderColors } from '../../theme/builderTheme';
import { AngaBlockCard, BlockPaletteItem } from './AngaBlockCard';

interface Props {
  blocks: BlockPaletteItem[];
  onAdd: (type: BlockPaletteItem['type']) => void;
}

export const AngaBlockLibrary = ({ blocks, onAdd }: Props) => (
  <View style={styles.wrap}>
    <Text style={styles.heading}>Anga Blocks</Text>
    <View style={styles.list}>{blocks.map((b) => <AngaBlockCard key={b.type} item={b} onAdd={onAdd} />)}</View>
  </View>
);

const styles = StyleSheet.create({
  wrap: { backgroundColor: builderColors.surfaceLow, borderRadius: 4, padding: 16, gap: 14 },
  heading: { color: builderColors.gold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5 },
  list: { gap: 10 }
});
