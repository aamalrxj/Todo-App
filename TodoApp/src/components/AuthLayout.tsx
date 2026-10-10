import React, { ReactNode } from 'react';
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Image,
} from 'react-native';
import { colors, cardShadow } from '../utils/theme';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

// Coloured brand header with a floating form card on top
const AuthLayout = ({ title, subtitle, children }: Props) => (
  <KeyboardAvoidingView
    style={styles.flex}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Image
            source={require('../assets/logo.webp')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.brand}>TaskFlow</Text>
        <Text style={styles.tagline}>Plan it. Do it. Done.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {children}
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1 },
  hero: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 80,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoImage: { width: 44, height: 44 },
  brand: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: 0.5 },
  tagline: { color: '#C7D2FE', fontSize: 14, marginTop: 4 },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: -48,
    marginBottom: 24,
    borderRadius: 24,
    padding: 24,
    ...cardShadow,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 4, marginBottom: 24 },
});

export default AuthLayout;