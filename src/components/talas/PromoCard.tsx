import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { talasColors } from '../../theme/talasTheme';

export const PromoCard = () => (
  <ImageBackground
    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt8SFpKhI95eu0IwXZAkpnp9C0LeMbnYwbOanv6WAZpecPn788i9YXLulSMUS_K_HqOndqIXz7uk0lkqB__x8S-kzN0w58FdZw3pQkUiQEjYpinEA96mB1qE-ntn7ln-v8HB-eafb4UXxlwz5ztb3PDF3U6R1Gk_rmSFF07qa2xHrFnm-6TwOHgsds6UVH7VSYi0U2qFMJQMjWVUIxkGvZyeYk-8hlFl4irZRo4Bx5p0a8aEhM3w06MNQivjWft0RbNRgectWfEHg' }}
    style={styles.image}
    imageStyle={styles.imageInner}
  >
    <View style={styles.overlay}>
      <Text style={styles.label}>Upcoming Class</Text>
      <Text style={styles.title}>Advanced Rhythm Geometry</Text>
    </View>
  </ImageBackground>
);

const styles = StyleSheet.create({
  image: { flex: 1, minHeight: 190, borderRadius: 4, overflow: 'hidden' },
  imageInner: { resizeMode: 'cover', opacity: 0.55 },
  overlay: { flex: 1, justifyContent: 'flex-end', padding: 18, backgroundColor: 'rgba(19,19,19,0.25)' },
  label: { color: talasColors.gold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  title: { color: talasColors.textPrimary, fontSize: 20, lineHeight: 24 }
});
