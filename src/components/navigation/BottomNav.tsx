import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../theme/tokens';

interface Props {
  active: 'Player' | 'Talas' | 'Templates' | 'Settings';
}

export const BottomNav = ({ active }: Props) => {
  const navigation = useNavigation();
  const items: Props['active'][] = ['Player', 'Talas', 'Templates', 'Settings'];

  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <Pressable key={item} style={styles.item} onPress={() => navigation.navigate(item as never)}>
          <Text style={[styles.icon, active === item && styles.active]}>{active === item ? '▣' : '◻'}</Text>
          <Text style={[styles.label, active === item && styles.active]}>{item}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(19,19,19,0.88)'
  },
  item: { alignItems: 'center' },
  icon: { color: colors.textMuted, fontSize: 16, marginBottom: 4 },
  label: { color: colors.textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  active: { color: colors.gold, fontWeight: '700' }
});
