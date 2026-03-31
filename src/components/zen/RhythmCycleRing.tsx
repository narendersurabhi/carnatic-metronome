import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { zenColors } from '../../theme/zenTheme';

interface Props {
  size: number;
  angaLengths: number[];
  angaLabels: string[];
  activeBeatIndex: number;
  totalBeats: number;
}

const RADIUS_RATIO = 0.46;

export const RhythmCycleRing = ({ size, angaLengths, angaLabels, activeBeatIndex, totalBeats }: Props) => {
  const center = size / 2;
  const radius = size * RADIUS_RATIO;
  const circumference = 2 * Math.PI * radius;

  let running = 0;
  const segments = angaLengths.map((beats, idx) => {
    const segment = (beats / totalBeats) * circumference;
    const dashOffset = -(running / totalBeats) * circumference;
    running += beats;

    return {
      key: `${idx}-${beats}`,
      segment,
      dashOffset,
      strokeWidth: idx === 0 ? 2 : 1,
      color: idx === 0 ? zenColors.gold : 'rgba(255,255,255,0.12)'
    };
  });

  const markerAngle = (-90 + (activeBeatIndex / totalBeats) * 360) * (Math.PI / 180);
  const markerX = center + Math.cos(markerAngle) * radius;
  const markerY = center + Math.sin(markerAngle) * radius;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {segments.map((segment) => (
          <Circle
            key={segment.key}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={segment.strokeWidth}
            strokeDasharray={`${segment.segment} ${circumference}`}
            strokeDashoffset={segment.dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        ))}

        {Array.from({ length: totalBeats }).map((_, i) => {
          const angle = (-90 + (i / totalBeats) * 360) * (Math.PI / 180);
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          return <Circle key={`dot-${i}`} cx={x} cy={y} r={1} fill="rgba(255,255,255,0.22)" />;
        })}

        <Circle cx={markerX} cy={markerY} r={5} fill={zenColors.gold} />
      </Svg>

      <View pointerEvents="none" style={styles.angaLabels}>
        <Text style={[styles.angaText, { left: size * 0.15 }]}>{angaLabels[0]}</Text>
        <Text style={[styles.angaText, { right: size * 0.18, top: 10 }]}>{angaLabels[1]}</Text>
        <Text style={[styles.angaText, { right: size * 0.12, bottom: 12 }]}>{angaLabels[2]}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  angaLabels: { ...StyleSheet.absoluteFillObject },
  angaText: {
    position: 'absolute',
    top: 10,
    color: zenColors.goldDim,
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: 'uppercase'
  }
});
