import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '../components/sound/BottomNav';
import { InstrumentGrid } from '../components/sound/InstrumentGrid';
import { InstrumentItem } from '../components/sound/InstrumentCard';
import { MixerSlider } from '../components/sound/MixerSlider';
import { SectionHeader } from '../components/sound/SectionHeader';
import { SettingsTopBar } from '../components/sound/SettingsTopBar';
import { SruthiHeader } from '../components/sound/SruthiHeader';
import { SruthiKeyPicker, SruthiNote } from '../components/sound/SruthiKeyPicker';
import { soundColors, soundSpacing, soundTypography } from '../theme/soundTheme';

const instruments: InstrumentItem[] = [
  { id: 'mridangam', title: 'Mridangam', subtitle: 'Earth & Skin', glyph: '≋' },
  { id: 'tabla', title: 'Tabla', subtitle: 'Bright Resonant', glyph: '≈' },
  { id: 'manjira', title: 'Manjira', subtitle: 'Sharp Metallic', glyph: '∿' },
  { id: 'bell', title: 'Bell', subtitle: 'Sanctum Echo', glyph: '◌' }
];

const sruthiNotes: SruthiNote[] = [
  { key: 'A', type: 'ivory' },
  { key: 'A#', type: 'wood' },
  { key: 'B', type: 'ivory' },
  { key: 'C', type: 'ivory' },
  { key: 'C#', type: 'wood' },
  { key: 'D', type: 'ivory' },
  { key: 'D#', type: 'wood' },
  { key: 'E', type: 'ivory' },
  { key: 'F', type: 'ivory' }
];

export const SoundSruthiScreen = () => {
  const [instrumentId, setInstrumentId] = useState('mridangam');
  const [sruthi, setSruthi] = useState('C#');
  const [droneEnabled, setDroneEnabled] = useState(true);
  const [metronomeGain, setMetronomeGain] = useState(82);
  const [dronePresence, setDronePresence] = useState(45);

  const sruthiLabel = useMemo(() => `${sruthi} Sharp`, [sruthi]);

  return (
    <SafeAreaView style={styles.safe}>
      <SettingsTopBar />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.overline}>Atmosphere & Tone</Text>
          <Text style={styles.hero}>Sound & Sruthi</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Percussion Texture" caption="SELECT MASTER VOICE" />
          <InstrumentGrid items={instruments} selectedId={instrumentId} onSelect={setInstrumentId} />
        </View>

        <View style={styles.section}>
          <SruthiHeader selectedLabel={sruthiLabel} droneEnabled={droneEnabled} onToggleDrone={() => setDroneEnabled((prev) => !prev)} />
          <SruthiKeyPicker notes={sruthiNotes} selectedKey={sruthi} onSelect={setSruthi} />
        </View>

        <View style={styles.mixerBox}>
          <View style={styles.mixerColumn}>
            <MixerSlider
              icon="◷"
              title="Metronome Gain"
              value={metronomeGain}
              leftLabel="SILENCE"
              rightLabel="CRESCENDO"
              onDecrease={() => setMetronomeGain((v) => Math.max(0, v - 1))}
              onIncrease={() => setMetronomeGain((v) => Math.min(100, v + 1))}
            />
          </View>
          <View style={styles.mixerDivider} />
          <View style={styles.mixerColumn}>
            <MixerSlider
              icon="◍"
              title="Drone Presence"
              value={dronePresence}
              leftLabel="SUBTLE"
              rightLabel="IMMERSIVE"
              onDecrease={() => setDronePresence((v) => Math.max(0, v - 1))}
              onIncrease={() => setDronePresence((v) => Math.min(100, v + 1))}
            />
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.temple}>⌂</Text>
          <View style={styles.line} />
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: soundColors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: soundSpacing.pageX, paddingTop: 18, paddingBottom: 130, gap: soundSpacing.sectionGap },
  overline: { ...soundTypography.heroOverline, color: soundColors.gold },
  hero: { ...soundTypography.heroTitle, color: soundColors.textPrimary, marginTop: 6 },
  section: { gap: 16 },
  mixerBox: {
    borderWidth: 1,
    borderColor: soundColors.border,
    backgroundColor: 'rgba(35,31,27,0.6)',
    borderRadius: 12,
    padding: 20,
    gap: 22
  },
  mixerColumn: { flex: 1 },
  mixerDivider: { height: 1, backgroundColor: soundColors.border },
  divider: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, paddingVertical: 12 },
  line: { width: 96, height: 1, backgroundColor: 'rgba(212,175,55,0.35)' },
  temple: { color: soundColors.gold, fontSize: 28, opacity: 0.7 }
});
