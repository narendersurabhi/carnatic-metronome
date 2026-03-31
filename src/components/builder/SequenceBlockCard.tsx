import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { builderColors } from '../../theme/builderTheme';

export interface SequenceBlock {
  id: string;
  type: 'LAGHU' | 'DHRUTAM' | 'ANUDHRUTAM';
  jatiCount?: 3 | 4 | 5 | 7 | 9;
}

interface Props {
  block: SequenceBlock;
  onRemove: () => void;
  onLaghuJatiChange: (id: string, jati: 3 | 4 | 5 | 7 | 9) => void;
}

const symbol = (b: SequenceBlock) => (b.type === 'LAGHU' ? `I${b.jatiCount ?? 4}` : b.type === 'DHRUTAM' ? 'O' : 'U');
const beats = (b: SequenceBlock) => (b.type === 'LAGHU' ? `${b.jatiCount ?? 4} Beats` : b.type === 'DHRUTAM' ? '2 Beats' : '1 Beat');

export const SequenceBlockCard = ({ block, onRemove, onLaghuJatiChange }: Props) => (
  <View style={[styles.card, { borderTopColor: block.type === 'LAGHU' ? builderColors.gold : block.type === 'DHRUTAM' ? builderColors.primaryContainer : builderColors.outline }]}>
    <View>
      <View style={styles.row}><Text style={styles.symbol}>{symbol(block)}</Text><Pressable onPress={onRemove}><Text style={styles.close}>✕</Text></Pressable></View>
    </View>
    <View style={styles.footer}>
      {block.type === 'LAGHU' ? (
        <View>
          <Text style={styles.meta}>Jati</Text>
          <View style={styles.jatiRow}>
            {[3, 4, 5, 7, 9].map((n) => (
              <Pressable key={n} onPress={() => onLaghuJatiChange(block.id, n as 3 | 4 | 5 | 7 | 9)} style={[styles.jatiPill, block.jatiCount === n && styles.jatiActive]}>
                <Text style={[styles.jatiText, block.jatiCount === n && styles.jatiTextActive]}>{n}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <View><Text style={styles.meta}>Constant</Text><Text style={styles.constant}>{beats(block)}</Text></View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { width: 132, height: 192, backgroundColor: builderColors.surfaceHighest, borderRadius: 4, borderTopWidth: 4, padding: 12, justifyContent: 'space-between' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  symbol: { color: builderColors.textPrimary, fontSize: 36 },
  close: { color: '#9a8f80', fontSize: 14 },
  footer: { borderTopWidth: 1, borderTopColor: builderColors.outlineSoft, paddingTop: 8 },
  meta: { color: '#9a8f80', fontSize: 8, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 },
  constant: { color: builderColors.textPrimary, fontSize: 11, fontWeight: '700' },
  jatiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  jatiPill: { borderWidth: 1, borderColor: builderColors.outlineSoft, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  jatiActive: { borderColor: builderColors.gold, backgroundColor: 'rgba(233,193,118,0.15)' },
  jatiText: { color: builderColors.textVariant, fontSize: 10 },
  jatiTextActive: { color: builderColors.gold }
});
