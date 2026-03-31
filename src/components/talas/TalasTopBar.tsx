import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { talasColors } from '../../theme/talasTheme';

export const TalasTopBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.icon}>♪</Text>
        <Text style={styles.title}>Laya & Temple</Text>
      </View>
      <Pressable style={styles.quickBtn}><Text style={styles.quickText}>Quick Start</Text></Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 64, backgroundColor: talasColors.topBar, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { color: talasColors.gold, fontSize: 18 },
  title: { color: talasColors.gold, fontSize: 24, fontWeight: '700', letterSpacing: 1 },
  quickBtn: { backgroundColor: talasColors.gold, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 4 },
  quickText: { color: '#412d00', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: '700' }
});
