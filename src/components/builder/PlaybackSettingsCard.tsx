import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { builderColors } from '../../theme/builderTheme';
import { RangeSliderRow } from './RangeSliderRow';

interface Props {
  bpm: number;
  volume: number;
  onBpmChange: (next: number) => void;
  onVolumeChange: (next: number) => void;
}

export const PlaybackSettingsCard = ({ bpm, volume, onBpmChange, onVolumeChange }: Props) => (
  <View style={styles.card}>
    <View style={styles.head}><Text style={styles.heading}>Playback Settings</Text><Text style={styles.context}>Adi Tala Context</Text></View>
    <RangeSliderRow label="Speed (BPM)" value={bpm} onDecrease={() => onBpmChange(Math.max(40, bpm - 1))} onIncrease={() => onBpmChange(Math.min(200, bpm + 1))} />
    <RangeSliderRow label="Volume" value={volume} unit="%" color={builderColors.primaryContainer} onDecrease={() => onVolumeChange(Math.max(0, volume - 1))} onIncrease={() => onVolumeChange(Math.min(100, volume + 1))} />
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: builderColors.surfaceLow, borderRadius: 4, padding: 16, gap: 16 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heading: { color: builderColors.textVariant, textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 11 },
  context: { color: builderColors.gold, fontSize: 12 }
});
