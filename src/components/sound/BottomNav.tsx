import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { soundColors } from '../../theme/soundTheme';

const items = ['Player', 'Talas', 'Templates', 'Settings'] as const;

export const BottomNav = () => {
  return (
    <View style={styles.nav}>
      {items.map((item) => {
        const active = item === 'Settings';
        return (
          <Pressable key={item} style={[styles.item, active && styles.itemActive]}>
            <Text style={[styles.icon, active && styles.activeText]}>{active ? '◉' : '○'}</Text>
            <Text style={[styles.label, active && styles.activeText]}>{item}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(57,52,47,0.84)',
    paddingTop: 10,
    paddingBottom: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  item: { alignItems: 'center', paddingTop: 4, paddingBottom: 6, opacity: 0.6 },
  itemActive: { opacity: 1, borderTopWidth: 2, borderTopColor: soundColors.gold, transform: [{ scale: 1.05 }] },
  icon: { color: soundColors.textMuted, fontSize: 16, marginBottom: 6 },
  label: { color: soundColors.textMuted, fontSize: 10 },
  activeText: { color: soundColors.gold }
});
