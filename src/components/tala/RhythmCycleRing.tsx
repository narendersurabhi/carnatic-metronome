import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/tokens';

interface RhythmCycleRingProps {
  activeBeat: number;
  totalBeats: number;
  angaLabels?: string[];
}

const toPosition = (radius: number, angleInDegrees: number) => {
  const radians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: radius + radius * Math.cos(radians),
    y: radius + radius * Math.sin(radians)
  };
};

export const RhythmCycleRing = ({ activeBeat, totalBeats, angaLabels = [] }: RhythmCycleRingProps) => {
  const safeTotal = Math.max(1, totalBeats);
  const safeBeat = ((Math.max(1, activeBeat) - 1) % safeTotal) + 1;
  const dotRadius = 146;
  const markerRadius = 152;
  const activeAngle = ((safeBeat - 1) / safeTotal) * 360;
  const activePosition = toPosition(dotRadius, activeAngle);

  const beatMarkers = Array.from({ length: safeTotal }, (_, index) => {
    const angle = (index / safeTotal) * 360;
    return {
      index,
      ...toPosition(markerRadius, angle)
    };
  });

  const labels = angaLabels.slice(0, 3);

  return (
    <View style={styles.frame}>
      <View style={styles.ring}>
        {beatMarkers.map((marker) => (
          <View key={`marker-${marker.index}`} style={[styles.marker, { left: marker.x, top: marker.y }]} />
        ))}
        <View style={[styles.activeDot, { left: activePosition.x, top: activePosition.y }]} />
        <Text style={styles.text}>{safeBeat}</Text>
      </View>
      {labels.length > 0 ? (
        <View style={styles.angaLabels}>
          {labels.map((label, index) => (
            <Text key={`${label}-${index}`} style={styles.angaLabel}>
              {label}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  frame: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: colors.gold,
    fontSize: 140,
    lineHeight: 148,
    fontWeight: '700',
    textShadowColor: 'rgba(233,193,118,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24
  },
  marker: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(229,226,225,0.25)',
    marginLeft: -2,
    marginTop: -2
  },
  activeDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.gold,
    borderWidth: 1,
    borderColor: colors.primaryContainer,
    marginLeft: -6,
    marginTop: -6
  },
  angaLabels: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  angaLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: 'rgba(233,193,118,0.7)'
  }
});
