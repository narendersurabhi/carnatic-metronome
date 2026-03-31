import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { zenColors } from '../../theme/zenTheme';

interface Props {
  isPlaying: boolean;
  onToggle: () => void;
}

export const PlayPauseButton = ({ isPlaying, onToggle }: Props) => {
  return (
    <Pressable style={styles.button} onPress={onToggle}>
      <Text style={styles.icon}>{isPlaying ? '❚❚' : '▶'}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: zenColors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(233,193,118,0.04)'
  },
  icon: { color: zenColors.gold, fontSize: 30 }
});
