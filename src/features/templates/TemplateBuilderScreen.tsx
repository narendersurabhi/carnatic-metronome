import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TopBar } from '../../components/common/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { BuilderHeader } from '../../components/builder/BuilderHeader';
import { TemplateNameInput } from '../../components/builder/TemplateNameInput';
import { AngaBlockLibrary } from '../../components/builder/AngaBlockLibrary';
import { SequenceStatsCard } from '../../components/builder/SequenceStatsCard';
import { SequenceTimeline } from '../../components/builder/SequenceTimeline';
import { PlaybackSettingsCard } from '../../components/builder/PlaybackSettingsCard';
import { PrimaryActionButton } from '../../components/builder/PrimaryActionButton';
import { SecondaryActionButton } from '../../components/builder/SecondaryActionButton';
import { useAppStore } from '../../state/appStore';
import { colors } from '../../theme/tokens';

const palette = [
  { type: 'LAGHU' as const, title: 'Laghu', description: 'Variable Length (4, 3, 5, 7, 9)', accentColor: colors.gold },
  { type: 'DHRUTAM' as const, title: 'Dhrutam', description: 'Fixed 2 Beats (O)', accentColor: colors.primaryContainer },
  { type: 'ANUDHRUTAM' as const, title: 'Anudhrutam', description: 'Fixed 1 Beat (U)', accentColor: '#9a8f80' }
];

export const TemplateBuilderScreen = () => {
  const s = useAppStore();
  const total = useMemo(() => s.currentTemplate.blocks.reduce((sum, b) => sum + (b.angaType === 'LAGHU' ? b.jatiCount ?? 4 : b.angaType === 'DHRUTAM' ? 2 : 1), 0), [s.currentTemplate.blocks]);
  return <View style={styles.screen}><TopBar /><ScrollView contentContainerStyle={styles.content}><View style={styles.head}><BuilderHeader /><TemplateNameInput value={s.currentTemplate.name} onChange={(v) => s.setField('currentTemplate', { ...s.currentTemplate, name: v })} /></View><View style={styles.main}><View style={styles.sidebar}><AngaBlockLibrary blocks={palette} onAdd={s.addBlock} /><SequenceStatsCard totalAksharas={total} angaCount={s.currentTemplate.blocks.length} /></View><View style={styles.right}><SequenceTimeline blocks={s.currentTemplate.blocks.map((b) => ({ id: b.id, type: b.angaType, jatiCount: b.jatiCount }))} onRemoveBlock={s.removeBlock} onLaghuJatiChange={s.setLaghuJati} onAddNext={() => s.addBlock('DHRUTAM')} /><PlaybackSettingsCard bpm={s.bpm} volume={s.metronomeGain} onBpmChange={(v) => s.setField('bpm', v)} onVolumeChange={(v) => s.setField('metronomeGain', v)} /><View style={styles.cta}><PrimaryActionButton label="Test Sequence" onPress={() => {}} /><View style={styles.row}><SecondaryActionButton label="Save Template" onPress={() => {}} /><SecondaryActionButton label="Export PDF" onPress={() => {}} /></View></View></View></View></ScrollView><BottomNav active="Templates" /></View>;
};

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, gap: 20, paddingBottom: 100 }, head: { gap: 20 }, main: { gap: 18 }, sidebar: { gap: 12 }, right: { gap: 12 }, cta: { gap: 10 }, row: { flexDirection: 'row', gap: 10 } });
