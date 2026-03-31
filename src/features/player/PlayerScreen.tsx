import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../state/appStore';
import { TopBar } from '../../components/common/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { RhythmCycleRing } from '../../components/tala/RhythmCycleRing';
import { colors } from '../../theme/tokens';

export const PlayerScreen = () => {
  const { isPlaying, togglePlay, activeBeat, tickBeat, bpm } = useAppStore();

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => tickBeat(8), Math.round(60000 / bpm));
    return () => clearInterval(id);
  }, [isPlaying, bpm, tickBeat]);

  return (
    <View style={styles.screen}>
      <TopBar />
      <View style={styles.content}>
        <Text style={styles.overline}>Chaturasra Jati</Text>
        <Text style={styles.title}>Aadi Tala</Text>
        <RhythmCycleRing activeBeat={activeBeat} totalBeats={8} />
        <Text style={styles.play} onPress={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </View>
      <BottomNav active="Player" />
    </View>
  );
};

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.background }, content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 80 }, overline: { color: colors.textMuted, letterSpacing: 2, textTransform: 'uppercase' }, title: { color: colors.text, fontSize: 42 }, play: { color: colors.gold, borderWidth: 1, borderColor: 'rgba(233,193,118,0.2)', borderRadius: 32, paddingHorizontal: 24, paddingVertical: 12 } });
