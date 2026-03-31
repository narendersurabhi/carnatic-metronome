import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { soundColors } from '../../theme/soundTheme';

interface Props {
  enabled: boolean;
  onToggle: () => void;
}

export const DroneToggle = ({ enabled, onToggle }: Props) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Tanpura Drone</Text>
      <Pressable style={[styles.track, enabled && styles.trackOn]} onPress={onToggle}>
        <View style={[styles.thumb, enabled && styles.thumbOn]} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: soundColors.surfaceElevated, borderColor: soundColors.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  label: { color: soundColors.textMuted, fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase' },
  track: { width: 48, height: 24, borderRadius: 20, borderWidth: 1, borderColor: soundColors.borderStrong, backgroundColor: soundColors.goldSoft, justifyContent: 'center', paddingHorizontal: 3 },
  trackOn: { backgroundColor: 'rgba(212,175,55,0.3)' },
  thumb: { width: 16, height: 16, borderRadius: 8, backgroundColor: soundColors.textMuted },
  thumbOn: { marginLeft: 'auto', backgroundColor: soundColors.gold }
});
