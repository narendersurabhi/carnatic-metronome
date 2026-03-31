import React from 'react';
import { StyleSheet, View } from 'react-native';

import { InstrumentCard, InstrumentItem } from './InstrumentCard';

interface Props {
  items: InstrumentItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const InstrumentGrid = ({ items, selectedId, onSelect }: Props) => {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <InstrumentCard key={item.id} item={item} selected={item.id === selectedId} onPress={onSelect} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }
});
