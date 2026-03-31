import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TopBar } from '../../components/common/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { JatiOptionCard } from '../../components/tala/JatiOptionCard';
import { useAppStore } from '../../state/appStore';
import { colors } from '../../theme/tokens';
import { jatiOptionsMock } from '../../state/mockData';
import { analytics } from '../../services/analytics/AnalyticsService';

export const JatiSelectionScreen = () => {
  const navigation = useNavigation();
  const { selectedJati, setField } = useAppStore();
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('TalaSelection' as never);
  };

  return (
    <View style={styles.screen}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>Mathematical Foundation</Text>
        <Text style={styles.title}>Select Jati</Text>
        <Text style={styles.subtitle}>Choose the rhythmic pulse that defines the number of aksharas per beat.</Text>
        <Pressable hitSlop={12} onPress={handleBack}>
          <Text style={styles.backToTalas}>← Back to Talas</Text>
        </Pressable>
        <View style={styles.list}>
          {jatiOptionsMock.map((o) => (
            <JatiOptionCard
              key={o.id}
              name={o.name}
              desc={o.description}
              count={o.count}
              active={selectedJati === o.id}
              onPress={() => {
                setField('selectedJati', o.id);
                analytics.track('jati_selected', { jati: o.id });
              }}
            />
          ))}
        </View>
        <Pressable hitSlop={12} onPress={handleBack}>
          <Text style={styles.close}>Cancel & Close</Text>
        </Pressable>
      </ScrollView>
      <BottomNav active="Talas" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, gap: 16, paddingBottom: 100 },
  eyebrow: { color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' },
  title: { color: colors.text, fontSize: 46, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: colors.textMuted, textAlign: 'center' },
  backToTalas: { color: colors.gold, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 12, minHeight: 44 },
  list: { gap: 12 },
  close: { color: colors.textMuted, textAlign: 'center', marginTop: 20, textTransform: 'uppercase', letterSpacing: 1.5, minHeight: 44 }
});
