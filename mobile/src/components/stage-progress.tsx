import Ionicons from '@expo/vector-icons/Ionicons';
import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from '@/theme';

// As três etapas do Reflorestar, na ordem do cadastro (stage.order).
const STAGES = ['Elaboração', 'Implantação', 'Monitoramento'];

export function StageProgress({ currentOrder }: { currentOrder: number | null }) {
  const current = currentOrder ? Math.min(Math.max(currentOrder, 1), STAGES.length) : 0;

  return (
    <View style={styles.wrap} accessibilityLabel={`Etapa ${current} de ${STAGES.length}: ${STAGES[current - 1] ?? 'não informada'}`}>
      <View style={styles.track}>
        {STAGES.map((name, index) => {
          const step = index + 1;
          const done = step < current;
          const active = step === current;
          return (
            <Fragment key={name}>
              {index > 0 && <View style={[styles.line, step <= current && styles.lineDone]} />}
              <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
                {done ? (
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                ) : (
                  <Text style={[styles.dotText, active && styles.dotTextActive]}>{step}</Text>
                )}
              </View>
            </Fragment>
          );
        })}
      </View>
      <View style={styles.labels}>
        {STAGES.map((name, index) => (
          <Text key={name} style={[styles.label, index + 1 === current && styles.labelActive]}>
            {name}
          </Text>
        ))}
      </View>
    </View>
  );
}

const DOT = 32;

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.sm, gap: spacing.sm },
  track: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg },
  line: { flex: 1, height: 3, backgroundColor: colors.line, borderRadius: 2 },
  lineDone: { backgroundColor: colors.leaf },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.line,
  },
  dotDone: { backgroundColor: colors.leaf, borderColor: colors.leaf },
  dotActive: { backgroundColor: colors.forest, borderColor: colors.forest, transform: [{ scale: 1.12 }] },
  dotText: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  dotTextActive: { color: colors.cream },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { flex: 1, textAlign: 'center', fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  labelActive: { fontFamily: fonts.bold, color: colors.forest },
});
