import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';

interface Props { showQuickStart?: boolean; }

export const TopBar = ({ showQuickStart = true }: Props) => (
  <View style={styles.container}>
    <View style={styles.left}><Text style={styles.icon}>♪</Text><Text style={styles.title}>Laya & Temple</Text></View>
    {showQuickStart ? <Pressable style={styles.btn}><Text style={styles.btnText}>Quick Start</Text></Pressable> : <View />}
  </View>
);

const styles = StyleSheet.create({
  container: { height: 64, paddingHorizontal: 24, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { color: colors.gold, fontSize: 18 },
  title: { color: colors.gold, fontSize: 22, fontWeight: '700' },
  btn: { backgroundColor: colors.gold, borderRadius: 4, paddingHorizontal: 14, paddingVertical: 8 },
  btnText: { color: '#412d00', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700' }
});
