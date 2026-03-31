import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { talasColors } from '../../theme/talasTheme';

const items = ['Player', 'Talas', 'Templates', 'Settings'] as const;

export const BottomNav = () => (
  <View style={styles.wrap}>
    {items.map((item) => {
      const active = item === 'Talas';
      return (
        <Pressable key={item} style={[styles.item, active && styles.active]}>
          <Text style={[styles.icon, active && styles.activeText]}>{active ? '▣' : '◻'}</Text>
          <Text style={[styles.label, active && styles.activeText]}>{item}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, paddingBottom: 26, backgroundColor: 'rgba(19,19,19,0.88)' },
  item: { alignItems: 'center', opacity: 0.7 },
  active: { opacity: 1, transform: [{ scale: 1.08 }] },
  icon: { color: talasColors.textVariant, fontSize: 22, marginBottom: 3 },
  label: { color: talasColors.textVariant, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  activeText: { color: talasColors.gold, fontWeight: '700' }
});
