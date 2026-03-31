import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { computeTemplateAksharas } from '../../domain/tala';
import { analytics } from '../../services/analytics/AnalyticsService';

const palette = [
  { type: 'LAGHU' as const, title: 'Laghu', description: 'Variable Length (4, 3, 5, 7, 9)', accentColor: colors.gold },
  { type: 'DHRUTAM' as const, title: 'Dhrutam', description: 'Fixed 2 Beats (O)', accentColor: colors.primaryContainer },
  { type: 'ANUDHRUTAM' as const, title: 'Anudhrutam', description: 'Fixed 1 Beat (U)', accentColor: '#9a8f80' }
];

const validateTemplateName = (name: string): string | null => {
  const value = name.trim();
  if (value.length < 3) {
    return 'Template name should be at least 3 characters.';
  }
  if (value.length > 40) {
    return 'Template name should be 40 characters or less.';
  }
  if (!/^[\w\- ]+$/u.test(value)) {
    return 'Use only letters, numbers, spaces, hyphen, or underscore.';
  }

  return null;
};

export const TemplateBuilderScreen = () => {
  const s = useAppStore();
  const [templateFeedback, setTemplateFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const total = useMemo(() => computeTemplateAksharas(s.currentTemplate.blocks, s.selectedJati), [s.currentTemplate.blocks, s.selectedJati]);
  const templateNameError = validateTemplateName(s.currentTemplate.name);

  const handleSave = () => {
    const error = validateTemplateName(s.currentTemplate.name);
    if (error) {
      setTemplateFeedback(error);
      return;
    }

    setIsSaving(true);
    s.saveCurrentTemplate();
    analytics.track('template_saved', { templateId: s.currentTemplate.id, templateName: s.currentTemplate.name.trim() });
    setTemplateFeedback('Template saved locally.');
    setIsSaving(false);
  };

  const handleDelete = () => {
    if (s.savedTemplates.length <= 1) {
      setTemplateFeedback('Keep at least one template.');
      return;
    }

    s.deleteTemplate(s.currentTemplate.id);
    setTemplateFeedback('Template deleted.');
  };

  return (
    <View style={styles.screen}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.head}>
          <BuilderHeader />
          <TemplateNameInput
            value={s.currentTemplate.name}
            errorText={templateFeedback && templateNameError ? templateFeedback : templateNameError}
            onChange={(v) => {
              s.setField('currentTemplate', { ...s.currentTemplate, name: v });
              setTemplateFeedback(null);
            }}
          />
          {templateFeedback && !templateNameError ? <Text style={styles.feedback}>{templateFeedback}</Text> : null}
        </View>
        <View style={styles.main}>
          <View style={styles.sidebar}>
            <AngaBlockLibrary blocks={palette} onAdd={s.addBlock} />
            <SequenceStatsCard totalAksharas={total} angaCount={s.currentTemplate.blocks.length} />
            <View style={styles.savedList}>
              <Text style={styles.savedTitle}>Saved Templates</Text>
              {s.savedTemplates.length === 0 ? <Text style={styles.empty}>No saved templates yet.</Text> : null}
              {s.savedTemplates.map((template) => (
                <SecondaryActionButton
                  key={template.id}
                  label={template.name}
                  onPress={() => {
                    s.loadTemplate(template.id);
                    analytics.track('template_loaded', { templateId: template.id, templateName: template.name });
                    setTemplateFeedback(null);
                  }}
                />
              ))}
            </View>
          </View>
          <View style={styles.right}>
            <SequenceTimeline
              blocks={s.currentTemplate.blocks.map((b) => ({ id: b.id, type: b.angaType, jatiCount: b.jatiCount }))}
              onRemoveBlock={s.removeBlock}
              onLaghuJatiChange={s.setLaghuJati}
              onAddNext={() => s.addBlock('DHRUTAM')}
            />
            <PlaybackSettingsCard bpm={s.bpm} volume={s.metronomeGain} onBpmChange={(v) => s.setField('bpm', v)} onVolumeChange={(v) => s.setField('metronomeGain', v)} />
            <View style={styles.cta}>
              <PrimaryActionButton label="Test Sequence" onPress={() => analytics.track('template_play', { templateId: s.currentTemplate.id })} />
              <View style={styles.row}>
                <SecondaryActionButton label={isSaving ? 'Saving...' : 'Save Template'} onPress={handleSave} disabled={isSaving} />
                <SecondaryActionButton label="Delete" onPress={handleDelete} disabled={s.savedTemplates.length <= 1} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNav active="Templates" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, gap: 20, paddingBottom: 100 },
  head: { gap: 20 },
  main: { gap: 18 },
  sidebar: { gap: 12 },
  right: { gap: 12 },
  cta: { gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  feedback: { color: colors.gold, fontSize: 12 },
  savedList: { gap: 8, marginTop: 10 },
  savedTitle: { color: colors.textMuted, textTransform: 'uppercase', fontSize: 10, letterSpacing: 1.2 },
  empty: { color: colors.textMuted, fontSize: 12 }
});
