import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { SelectableList } from '../components/SelectableList';
import { listInstruments } from '../store/metronomeStore';
import { useMetronomeStore } from '../store/metronomeStore';

export const InstrumentSelectorScreen = () => {
  const selectedInstrument = useMetronomeStore((s) => s.selectedInstrument);
  const setInstrument = useMetronomeStore((s) => s.setInstrument);

  return (
    <SafeAreaView style={styles.container}>
      <SelectableList
        title="Select Instrument"
        options={listInstruments()}
        selected={selectedInstrument}
        onSelect={setInstrument}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e1116', padding: 16 }
});
