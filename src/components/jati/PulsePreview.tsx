import React from 'react';
import { StyleSheet, View } from 'react-native';

import { jatiColors } from '../../theme/jatiTheme';

interface Props {
  count: number;
  active: boolean;
}

export const PulsePreview = ({ count, active }: Props) => {
  const dotSize = count >= 9 ? 8 : count >= 7 ? 10 : 12;
  const wrapStyle = count >= 7 ? styles.wrapCompact : styles.wrap;

  return (
    <View style={wrapStyle}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { width: dotSize, height: dotSize, borderRadius: dotSize / 2 },
            active ? styles.dotActive : styles.dotInactive
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 8 },
  wrapCompact: { flexDirection: 'row', flexWrap: 'wrap', width: 100, justifyContent: 'flex-end', gap: 6 },
  dot: {},
  dotActive: { backgroundColor: jatiColors.gold, shadowColor: jatiColors.gold, shadowOpacity: 0.5, shadowRadius: 6 },
  dotInactive: { backgroundColor: jatiColors.outline }
});
