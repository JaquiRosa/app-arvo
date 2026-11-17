import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, font, fonts, radius, shadow, spacing } from '@/theme';
import { ArvoSymbol } from './brand';

export type IconName = ComponentProps<typeof Ionicons>['name'];

type ScreenProps = {
  title: string;
  eyebrow?: string;
  header?: ReactNode; // conteúdo extra dentro do cabeçalho verde (ex.: seletor de propriedade)
  children: ReactNode;
};

// Cabeçalho verde com a árvore da Arvo ao fundo; o conteúdo sobe por cima da borda em cartões.
export function Screen({ title, eyebrow, header, children }: ScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <ArvoSymbol size={220} color={colors.cream} style={styles.watermark} />
        <View style={styles.inner}>
          {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {header}
        </View>
      </View>
      <View style={[styles.inner, styles.body]}>{children}</View>
    </ScrollView>
  );
}

export function Card({ title, icon, children }: { title?: string; icon?: IconName; children: ReactNode }) {
  return (
    <View style={styles.card}>
      {title && (
        <View style={styles.cardHeader}>
          {icon && <IconBubble name={icon} />}
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
      )}
      {children}
    </View>
  );
}

export function IconBubble({ name, tone = 'leaf' }: { name: IconName; tone?: 'leaf' | 'earth' }) {
  const earth = tone === 'earth';
  return (
    <View style={[styles.bubble, { backgroundColor: earth ? colors.earthSoft : colors.leafSoft }]}>
      <Ionicons name={name} size={20} color={earth ? colors.earth : colors.forest} />
    </View>
  );
}

// Espaço reservado para o que ainda vai ser construído nas próximas entregas.
export function ComingSoon({
  title,
  description,
  icon,
  tone,
}: {
  title: string;
  description: string;
  icon: IconName;
  tone?: 'leaf' | 'earth';
}) {
  return (
    <View style={[styles.card, styles.soon]}>
      <IconBubble name={icon} tone={tone} />
      <View style={styles.soonText}>
        <View style={styles.soonTitleRow}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.badge}>Em breve</Text>
        </View>
        <Text style={textStyles.muted}>{description}</Text>
      </View>
    </View>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={textStyles.muted}>{label}</Text>
      <Text style={[textStyles.strong, styles.infoValue]}>{value}</Text>
    </View>
  );
}

export const textStyles = StyleSheet.create({
  body: { fontFamily: fonts.regular, fontSize: font.body, color: colors.text, lineHeight: 22 },
  muted: { fontFamily: fonts.regular, fontSize: font.label, color: colors.muted, lineHeight: 20 },
  strong: { fontFamily: fonts.semibold, fontSize: font.body, color: colors.text },
  section: {
    fontFamily: fonts.semibold,
    fontSize: font.small,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.sm,
  },
});

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.cream },
  scrollContent: { paddingBottom: spacing.xl },
  header: {
    backgroundColor: colors.forest,
    paddingBottom: spacing.xl + spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    overflow: 'hidden',
  },
  watermark: { position: 'absolute', right: -60, top: -20, opacity: 0.08 },
  inner: { width: '100%', maxWidth: 640, alignSelf: 'center' },
  eyebrow: { fontFamily: fonts.medium, fontSize: font.label, color: colors.sand, marginBottom: 2 },
  title: { fontFamily: fonts.bold, fontSize: font.big, color: colors.cream },
  body: { paddingHorizontal: spacing.md, marginTop: -spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 4 },
  cardTitle: { fontFamily: fonts.bold, fontSize: font.body, color: colors.text, flexShrink: 1 },
  bubble: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  soon: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm + 4 },
  soonText: { flex: 1, gap: 2 },
  soonTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  badge: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.earth,
    backgroundColor: colors.earthSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  infoValue: { flexShrink: 1, textAlign: 'right' },
});
