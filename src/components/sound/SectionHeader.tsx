import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { soundColors, soundTypography } from '../../theme/soundTheme';

interface Props {
  title: string;
  caption?: string;
}

export const SectionHeader = ({ title, caption }: Props) => {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 1, borderBottomColor: soundColors.goldSoft, paddingBottom: 8 },
  title: { ...soundTypography.sectionTitle, color: soundColors.gold },
  caption: { color: soundColors.textMuted, fontSize: 10, letterSpacing: 2, opacity: 0.7 }
});
