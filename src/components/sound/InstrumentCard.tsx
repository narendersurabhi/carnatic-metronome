import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { soundColors, soundTypography } from '../../theme/soundTheme';

export interface InstrumentItem {
  id: string;
  title: string;
  subtitle: string;
  glyph: string;
}

interface Props {
  item: InstrumentItem;
  selected: boolean;
  onPress: (id: string) => void;
}

export const InstrumentCard = ({ item, selected, onPress }: Props) => {
  return (
    <Pressable style={[styles.card, selected ? styles.cardSelected : styles.cardIdle]} onPress={() => onPress(item.id)}>
      <View style={styles.header}>
        <Text style={[styles.glyph, selected ? styles.glyphSelected : styles.glyphIdle]}>{item.glyph}</Text>
        {selected ? <View style={styles.dot} /> : null}
      </View>
      <Text style={[styles.title, selected ? styles.titleSelected : styles.titleIdle]}>{item.title}</Text>
      <Text style={[styles.subtitle, selected ? styles.subtitleSelected : styles.subtitleIdle]}>{item.subtitle}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: { width: '48%', borderRadius: 8, padding: 16, minHeight: 144 },
  cardSelected: {
    borderWidth: 1,
    borderColor: soundColors.gold,
    backgroundColor: soundColors.surface
  },
  cardIdle: { borderWidth: 1, borderColor: soundColors.border, backgroundColor: 'rgba(32,31,31,0.45)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  glyph: { fontSize: 28 },
  glyphSelected: { color: soundColors.gold },
  glyphIdle: { color: 'rgba(234,225,218,0.5)' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: soundColors.gold },
  title: { ...soundTypography.cardTitle, marginBottom: 4 },
  titleSelected: { color: soundColors.textPrimary },
  titleIdle: { color: 'rgba(234,225,218,0.75)' },
  subtitle: { ...soundTypography.labelTiny },
  subtitleSelected: { color: soundColors.gold },
  subtitleIdle: { color: 'rgba(208,197,175,0.7)' }
});
