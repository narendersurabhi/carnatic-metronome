import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TopBar } from '../../components/common/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { InstrumentCard } from '../../components/tala/InstrumentCard';
import { SliderRow } from '../../components/common/SliderRow';
import { useAppStore } from '../../state/appStore';
import { colors } from '../../theme/tokens';

const instruments = [
  { id: 'Mridangam', subtitle: 'Earth & Skin' },
  { id: 'Tabla', subtitle: 'Bright Resonant' },
  { id: 'Manjira', subtitle: 'Sharp Metallic' },
  { id: 'Bell', subtitle: 'Sanctum Echo' },
  { id: 'Synth Click', subtitle: 'Web Audio Fallback' }
];

const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F'];

export const SoundAndSruthiScreen = () => {
  const s = useAppStore();
  return <View style={styles.screen}><TopBar /><ScrollView contentContainerStyle={styles.content}><Text style={styles.overline}>Atmosphere & Tone</Text><Text style={styles.title}>Sound & Sruthi</Text><Text style={styles.section}>Percussion Texture</Text><View style={styles.grid}>{instruments.map((i) => <InstrumentCard key={i.id} title={i.id} subtitle={i.subtitle} active={s.selectedInstrument === i.id} onPress={() => s.setField('selectedInstrument', i.id)} />)}</View><View style={styles.sruthiRow}><Text style={styles.section}>Sruthi / Pitch</Text><Text style={styles.chip}>{s.sruthi} Sharp</Text><Text style={styles.toggle} onPress={() => s.setField('droneEnabled', !s.droneEnabled)}>Tanpura Drone: {s.droneEnabled ? 'On' : 'Off'}</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.notes}>{notes.map((n) => <Text key={n} style={[styles.note, s.sruthi === n && styles.noteActive]} onPress={() => s.setField('sruthi', n)}>{n}</Text>)}</ScrollView><SliderRow label="Metronome Gain" value={s.metronomeGain} onChange={(v) => s.setField('metronomeGain', v)} /><SliderRow label="Drone Presence" value={s.droneGain} onChange={(v) => s.setField('droneGain', v)} /></ScrollView><BottomNav active="Settings" /></View>;
};

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, gap: 14, paddingBottom: 100 }, overline: { color: colors.gold, textTransform: 'uppercase', letterSpacing: 3 }, title: { color: colors.text, fontSize: 42, fontWeight: '700' }, section: { color: colors.gold, fontSize: 28 }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }, sruthiRow: { gap: 8 }, chip: { color: colors.gold, borderWidth: 1, borderColor: 'rgba(233,193,118,0.3)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontSize: 10, textTransform: 'uppercase' }, toggle: { color: colors.textMuted, fontSize: 10, textTransform: 'uppercase' }, notes: { alignItems: 'flex-end', gap: 8 }, note: { width: 54, height: 92, textAlign: 'center', textAlignVertical: 'center', backgroundColor: '#f9f5f0', color: '#3d2b1f' }, noteActive: { backgroundColor: '#3d2b1f', color: colors.gold, fontSize: 30, fontWeight: '700' } });
