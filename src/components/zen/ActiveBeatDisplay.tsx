import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { zenColors, zenTypography } from '../../theme/zenTheme';

interface Props {
  beatLabel: string;
}

export const ActiveBeatDisplay = ({ beatLabel }: Props) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.02, duration: 140, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();
  }, [beatLabel, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Text style={styles.text}>{beatLabel}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    ...zenTypography.beatDisplay,
    color: zenColors.gold,
    textShadowColor: 'rgba(233,193,118,0.24)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 35
  }
});
