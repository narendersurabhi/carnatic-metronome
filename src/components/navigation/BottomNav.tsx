import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';

interface Props { active: 'Player' | 'Talas' | 'Templates' | 'Settings'; }

export const BottomNav = ({ active }: Props) => {
  const items: Props['active'][] = ['Player', 'Talas', 'Templates', 'Settings'];
  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <View key={item} style={styles.item}>
          <Text style={[styles.icon, active === item && styles.active]}>{active === item ? '▣' : '◻'}</Text>
          <Text style={[styles.label, active === item && styles.active]}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, paddingBottom: 20, backgroundColor: 'rgba(19,19,19,0.88)' },
  item: { alignItems: 'center' },
  icon: { color: colors.textMuted, fontSize: 16, marginBottom: 4 },
  label: { color: colors.textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  active: { color: colors.gold, fontWeight: '700' }
});
