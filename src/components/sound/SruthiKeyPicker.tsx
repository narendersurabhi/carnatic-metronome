import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { soundColors } from '../../theme/soundTheme';

export interface SruthiNote {
  key: string;
  type: 'ivory' | 'wood';
}

interface Props {
  notes: SruthiNote[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export const SruthiKeyPicker = ({ notes, selectedKey, onSelect }: Props) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      {notes.map((note) => {
        const selected = note.key === selectedKey;
        const isWood = note.type === 'wood';
        return (
          <Pressable
            key={note.key}
            style={[
              styles.key,
              isWood ? styles.woodKey : styles.ivoryKey,
              selected && styles.selected,
              isWood ? styles.woodSize : styles.ivorySize
            ]}
            onPress={() => onSelect(note.key)}
          >
            <Text style={[styles.keyText, isWood ? styles.woodText : styles.ivoryText, selected && styles.selectedText]}>{note.key}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: { alignItems: 'flex-end', paddingVertical: 10, paddingRight: 24 },
  key: { marginRight: 6, alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  ivorySize: { width: 62, height: 112 },
  woodSize: { width: 50, height: 84, marginBottom: 12 },
  ivoryKey: { backgroundColor: soundColors.keyIvoryTop, borderBottomWidth: 4, borderBottomColor: soundColors.keyIvoryBottom },
  woodKey: { backgroundColor: soundColors.keyWoodTop, borderBottomWidth: 4, borderBottomColor: soundColors.keyWoodBottom },
  selected: { width: 74, height: 136, borderWidth: 1, borderColor: soundColors.goldBright, transform: [{ translateY: -4 }] },
  keyText: { fontSize: 24 },
  ivoryText: { color: 'rgba(61,43,31,0.5)' },
  woodText: { color: 'rgba(212,175,55,0.45)', fontSize: 18 },
  selectedText: { color: soundColors.gold, fontSize: 40, fontWeight: '700' }
});
