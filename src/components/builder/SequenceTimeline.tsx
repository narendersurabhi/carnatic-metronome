import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { builderColors } from '../../theme/builderTheme';
import { AddNextBlockCard } from './AddNextBlockCard';
import { SequenceBlock, SequenceBlockCard } from './SequenceBlockCard';

interface Props {
  blocks: SequenceBlock[];
  onRemoveBlock: (id: string) => void;
  onLaghuJatiChange: (id: string, jati: 3 | 4 | 5 | 7 | 9) => void;
  onAddNext: () => void;
}

export const SequenceTimeline = ({ blocks, onRemoveBlock, onLaghuJatiChange, onAddNext }: Props) => (
  <View style={styles.canvas}>
    <Text style={styles.caption}>Active Sequence Timeline</Text>
    <ScrollView horizontal contentContainerStyle={styles.row} showsHorizontalScrollIndicator={false}>
      {blocks.map((b) => (
        <SequenceBlockCard key={b.id} block={b} onRemove={() => onRemoveBlock(b.id)} onLaghuJatiChange={onLaghuJatiChange} />
      ))}
      <AddNextBlockCard onPress={onAddNext} />
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  canvas: { minHeight: 300, backgroundColor: builderColors.surfaceLow, borderRadius: 4, padding: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(78,70,57,0.3)' },
  caption: { color: '#9a8f80', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14 },
  row: { alignItems: 'center', gap: 12, paddingRight: 12 }
});
