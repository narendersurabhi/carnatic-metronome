import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { talasColors } from '../../theme/talasTheme';

interface Props {
  title: string;
  body: string;
}

export const InsightCard = ({ title, body }: Props) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>{body}</Text>
    <View style={styles.iconWrap}><Text style={styles.icon}>💡</Text></View>
  </View>
);

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: talasColors.surfaceContainer, borderRadius: 4, borderWidth: 1, borderColor: talasColors.borderSoft, padding: 18, minHeight: 190 },
  title: { color: talasColors.gold, fontSize: 22, marginBottom: 10 },
  body: { color: talasColors.textVariant, fontSize: 14, lineHeight: 20 },
  iconWrap: { flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' },
  icon: { fontSize: 28, color: talasColors.gold }
});
