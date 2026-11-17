import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { ArvoWordmark } from '@/components/brand';
import { Card, ComingSoon, InfoRow, Screen, textStyles } from '@/components/screen';
import { useProfile } from '@/hooks/use-profile';
import { colors, font, fonts, radius, spacing } from '@/theme';
import { maskPhone } from '@/utils/phone';

const initials = (name: string) =>
  name
    .split(' ')
    .filter((part) => /^[A-Za-zÀ-ú]/.test(part))
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export default function ProfileScreen() {
  const { data: profile } = useProfile();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <Screen eyebrow="Minha conta" title="Perfil">
      {profile && (
        <Card>
          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(profile.name)}</Text>
            </View>
            <Text style={styles.name}>{profile.name}</Text>
          </View>
          <InfoRow label="Telefone" value={profile.phone ? maskPhone(profile.phone) : '—'} />
          <InfoRow label="Propriedades" value={String(profile.properties.length)} />
          <Text style={[textStyles.muted, styles.note]}>Para alterar seus dados, fale com a Arvo.</Text>
        </Card>
      )}
      <ComingSoon title="Avisos" description="Comunicados da Arvo sobre o seu projeto." icon="notifications-outline" />

      <Pressable
        onPress={handleSignOut}
        style={({ pressed }) => [styles.signOut, pressed && { backgroundColor: colors.dangerSoft }]}
        accessibilityRole="button"
      >
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.signOutText}>Sair do app</Text>
      </Pressable>

      <View style={styles.footer}>
        <ArvoWordmark size={72} color={colors.olive} />
        <Text style={styles.version}>Portal do Produtor · versão de teste</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.bold, fontSize: 22, color: colors.cream },
  name: { fontFamily: fonts.bold, fontSize: font.title - 2, color: colors.text, textAlign: 'center' },
  note: { marginTop: spacing.xs },
  signOut: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.danger,
    borderRadius: radius.md,
    minHeight: 52,
  },
  signOutText: { fontFamily: fonts.bold, fontSize: font.body, color: colors.danger },
  footer: { alignItems: 'center', gap: spacing.xs, marginTop: spacing.md, opacity: 0.8 },
  version: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
});
