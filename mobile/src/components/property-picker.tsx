import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useSelectedProperty } from '@/hooks/selected-property';
import { colors, fonts, radius, spacing } from '@/theme';

// Aparece no cabeçalho verde só para quem tem mais de uma propriedade.
export function PropertyPicker() {
  const { property, properties, select } = useSelectedProperty();
  if (properties.length < 2) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} style={styles.scroll}>
      {properties.map((item) => {
        const active = item.id === property?.id;
        return (
          <Pressable
            key={item.id}
            onPress={() => select(item.id)}
            style={[styles.chip, active && styles.chipActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Ionicons name="location" size={14} color={active ? colors.forest : colors.cream} />
            <Text style={[styles.text, active && styles.textActive]} numberOfLines={1}>
              {item.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginTop: spacing.md, marginHorizontal: -spacing.md },
  row: { gap: spacing.sm, paddingHorizontal: spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(244,241,229,0.45)',
  },
  chipActive: { backgroundColor: colors.cream, borderColor: colors.cream },
  text: { fontFamily: fonts.semibold, fontSize: 13, color: colors.cream, maxWidth: 220 },
  textActive: { color: colors.forest },
});
