import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { jatiColors, jatiTypography } from '../../theme/jatiTheme';
import { PulsePreview } from './PulsePreview';
import { SelectionPill } from './SelectionPill';

export interface JatiOption {
  id: string;
  name: string;
  description: string;
  count: number;
}

interface Props {
  option: JatiOption;
  active: boolean;
  onPress: () => void;
}

export const JatiOptionCard = ({ option, active, onPress }: Props) => (
  <Pressable style={[styles.card, active ? styles.active : styles.inactive]} onPress={onPress}>
    {active ? <View style={styles.leftAccent} /> : null}
    <View style={styles.left}>
      <View style={styles.topRow}>
        <Text style={[styles.name, active && styles.nameActive]}>{option.name}</Text>
        {active ? <SelectionPill /> : null}
      </View>
      <Text style={styles.desc}>{option.description}</Text>
    </View>

    <View style={[styles.previewWrap, active ? styles.previewActive : styles.previewInactive]}>
      <PulsePreview count={option.count} active={active} />
      <Text style={[styles.count, active && styles.countActive]}>{option.count}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: { minHeight: 132, borderRadius: 4, padding: 20, flexDirection: 'column', gap: 18 },
  active: { backgroundColor: jatiColors.surfaceContainer, position: 'relative' },
  inactive: { backgroundColor: jatiColors.surfaceLow, borderWidth: 1, borderColor: 'transparent' },
  leftAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: jatiColors.gold },
  left: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  name: { ...jatiTypography.optionTitle, color: jatiColors.textPrimary },
  nameActive: { color: jatiColors.gold },
  desc: { color: jatiColors.textVariant, fontSize: 14 },
  previewWrap: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', gap: 14, padding: 12, borderRadius: 4 },
  previewActive: { backgroundColor: 'rgba(53,53,52,0.3)' },
  previewInactive: { backgroundColor: 'rgba(32,31,31,0.5)' },
  count: { fontSize: 42, color: jatiColors.textVariant },
  countActive: { color: jatiColors.gold }
});
