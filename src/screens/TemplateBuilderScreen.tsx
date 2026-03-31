import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AngaBlockLibrary } from '../components/builder/AngaBlockLibrary';
import { BlockPaletteItem } from '../components/builder/AngaBlockCard';
import { BottomNav } from '../components/builder/BottomNav';
import { BuilderHeader } from '../components/builder/BuilderHeader';
import { PlaybackSettingsCard } from '../components/builder/PlaybackSettingsCard';
import { PrimaryActionButton } from '../components/builder/PrimaryActionButton';
import { SecondaryActionButton } from '../components/builder/SecondaryActionButton';
import { SequenceBlock } from '../components/builder/SequenceBlockCard';
import { SequenceStatsCard } from '../components/builder/SequenceStatsCard';
import { SequenceTimeline } from '../components/builder/SequenceTimeline';
import { TemplateNameInput } from '../components/builder/TemplateNameInput';
import { TalasTopBar } from '../components/talas/TalasTopBar';
import { builderColors } from '../theme/builderTheme';

const BLOCK_LIBRARY: BlockPaletteItem[] = [
  { type: 'LAGHU', title: 'Laghu', description: 'Variable Length (4, 3, 5, 7, 9)', accentColor: builderColors.gold },
  { type: 'DHRUTAM', title: 'Dhrutam', description: 'Fixed 2 Beats (O)', accentColor: builderColors.primaryContainer },
  { type: 'ANUDHRUTAM', title: 'Anudhrutam', description: 'Fixed 1 Beat (U)', accentColor: '#9a8f80' }
];

const initialBlocks: SequenceBlock[] = [
  { id: 'b1', type: 'LAGHU', jatiCount: 4 },
  { id: 'b2', type: 'DHRUTAM' },
  { id: 'b3', type: 'DHRUTAM' }
];

export const TemplateBuilderScreen = () => {
  const [name, setName] = useState('');
  const [blocks, setBlocks] = useState<SequenceBlock[]>(initialBlocks);
  const [bpm, setBpm] = useState(75);
  const [volume, setVolume] = useState(85);

  const totalAksharas = useMemo(
    () => blocks.reduce((sum, b) => sum + (b.type === 'LAGHU' ? b.jatiCount ?? 4 : b.type === 'DHRUTAM' ? 2 : 1), 0),
    [blocks]
  );

  const addBlock = (type: SequenceBlock['type']) => {
    setBlocks((prev) => [...prev, { id: `b-${Date.now()}-${Math.random()}`, type, jatiCount: type === 'LAGHU' ? 4 : undefined }]);
  };

  const removeBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));

  const changeLaghuJati = (id: string, jati: 3 | 4 | 5 | 7 | 9) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, jatiCount: jati } : b)));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TalasTopBar />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <BuilderHeader />
          <TemplateNameInput value={name} onChange={setName} />
        </View>

        <View style={styles.mainGrid}>
          <View style={styles.sidebar}>
            <AngaBlockLibrary blocks={BLOCK_LIBRARY} onAdd={addBlock} />
            <SequenceStatsCard totalAksharas={totalAksharas} angaCount={blocks.length} />
          </View>

          <View style={styles.timelineArea}>
            <SequenceTimeline blocks={blocks} onRemoveBlock={removeBlock} onLaghuJatiChange={changeLaghuJati} onAddNext={() => addBlock('DHRUTAM')} />

            <View style={styles.bottomGrid}>
              <PlaybackSettingsCard bpm={bpm} volume={volume} onBpmChange={setBpm} onVolumeChange={setVolume} />

              <View style={styles.ctaStack}>
                <PrimaryActionButton label="Test Sequence" onPress={() => {}} />
                <View style={styles.secondaryRow}>
                  <SecondaryActionButton label="Save Template" onPress={() => {}} />
                  <SecondaryActionButton label="Export PDF" onPress={() => {}} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: builderColors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 120, gap: 20 },
  headerRow: { gap: 20 },
  mainGrid: { gap: 20 },
  sidebar: { gap: 14 },
  timelineArea: { gap: 18 },
  bottomGrid: { gap: 12 },
  ctaStack: { gap: 10 },
  secondaryRow: { flexDirection: 'row', gap: 10 }
});
