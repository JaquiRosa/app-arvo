import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, font, fonts, radius, spacing } from '@/theme';

// Chamada no Início para quem ainda não entrou. O botão leva para a aba Propriedade, onde fica o login.
export function SignInInvite() {
  function openSignIn() {
    router.navigate('/propriedade');
  }

  return (
    <View style={styles.card}>
      <View style={styles.iconRing}>
        <View style={styles.iconCircle}>
          <Ionicons name="home" size={24} color={colors.cream} />
        </View>
        <View style={styles.leafBadge}>
          <Ionicons name="leaf" size={13} color={colors.cream} />
        </View>
      </View>

      <Text style={styles.title} accessibilityRole="header">
        Acesse sua propriedade
      </Text>

      <Pressable
        onPress={openSignIn}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Entrar na minha conta</Text>
        <Ionicons name="arrow-forward" size={18} color={colors.white} />
      </Pressable>
    </View>
  );
}

const ICON = 52;
const RING = ICON + 12;
const BADGE = 24;

const styles = StyleSheet.create({
  card: {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderTopWidth: 4,
    borderTopColor: colors.sand,
    paddingHorizontal: spacing.md + 4,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    shadowColor: colors.forestDeep,
    // Sombra mais forte que a dos outros cartões para a chamada de login se destacar.
    shadowOpacity: 0.3,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  iconRing: {
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    backgroundColor: colors.leafSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: ICON,
    height: ICON,
    borderRadius: ICON / 2,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafBadge: {
    position: 'absolute',
    right: 0,
    bottom: 2,
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    backgroundColor: colors.leaf,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.forest,
    textAlign: 'center',
    marginTop: spacing.sm + 4,
  },
  button: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.orange,
    borderRadius: radius.md,
    minHeight: 48,
    marginTop: spacing.sm + 6,
  },
  buttonPressed: { backgroundColor: colors.orangeDark },
  buttonText: { fontFamily: fonts.bold, fontSize: font.body, color: colors.white },
});
