import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SelectableListProps<T extends string> {
  title: string;
  options: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
}

export function SelectableList<T extends string>({ title, options, selected, onSelect }: SelectableListProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {options.map((option) => {
        const isActive = option === selected;
        return (
          <Pressable key={option} onPress={() => onSelect(option)} style={[styles.item, isActive && styles.itemActive]}>
            <Text style={[styles.itemText, isActive && styles.itemTextActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  title: { fontSize: 18, fontWeight: '700', color: '#f4f4f5', marginBottom: 8 },
  item: { backgroundColor: '#1f2430', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#2c3342' },
  itemActive: { backgroundColor: '#f5b300', borderColor: '#f5b300' },
  itemText: { color: '#e4e7ec', fontWeight: '500' },
  itemTextActive: { color: '#0e1116', fontWeight: '700' }
});
