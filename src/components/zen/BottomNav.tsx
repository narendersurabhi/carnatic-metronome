import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { zenColors } from '../../theme/zenTheme';

const items = ['Zen', 'Talas', 'Library', 'Setup'] as const;

export const BottomNav = () => {
  return (
    <View style={styles.container}>
      {items.map((item, idx) => {
        const active = idx === 0;
        return (
          <Pressable key={item} style={styles.item}>
            <Text style={[styles.icon, active && styles.active]}>{active ? '●' : '○'}</Text>
            <Text style={[styles.label, active && styles.active]}>{item}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    paddingBottom: 30,
    backgroundColor: 'rgba(19,19,19,0.7)'
  },
  item: { alignItems: 'center' },
  icon: { color: zenColors.textSubtle, fontSize: 16, marginBottom: 6 },
  label: { color: zenColors.textSubtle, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' },
  active: { color: zenColors.gold }
});
