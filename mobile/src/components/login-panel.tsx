import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { useAuth } from '@/auth/auth-context';
import { ArvoSymbol, ArvoWordmark } from '@/components/brand';
import { colors, font, fonts, radius, spacing } from '@/theme';
import { isCompletePhone, maskPhone } from '@/utils/phone';

// TODO: trocar pelo WhatsApp oficial do escritório da Arvo.
const ARVO_WHATSAPP = 'https://wa.me/5527000000000';
const MIN_PASSWORD = 4;

// Aparece na aba Propriedade enquanto o produtor não entrou. Depois do login a própria aba
// troca para os dados da propriedade (o token muda no AuthProvider).
export function LoginPanel() {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<'phone' | 'password' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const canSubmit = isCompletePhone(phone) && password.length >= MIN_PASSWORD && !sending;

  async function handleSubmit() {
    if (!canSubmit) return;
    setError(null);
    setSending(true);
    try {
      await signIn(phone, password);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível entrar. Tente de novo.');
      setSending(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
        <View style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}>
          <ArvoSymbol size={320} style={styles.watermark} />
          <ArvoSymbol size={76} />
          <ArvoWordmark size={150} style={styles.wordmark} />
          <Text style={styles.tagline}>Portal do Produtor</Text>
        </View>

        <View style={styles.sheet}>
          <View style={styles.form}>
            <Text style={styles.title} accessibilityRole="header">
              Acesse sua propriedade
            </Text>
            <Text style={styles.subtitle}>
              Entre na sua conta para ver áreas, localização e dados do seu projeto.
            </Text>

            <Text style={styles.label}>Telefone com DDD</Text>
            <View style={[styles.field, focused === 'phone' && styles.fieldFocused]}>
              <Ionicons name="call-outline" size={20} color={focused === 'phone' ? colors.forest : colors.muted} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={(value) => setPhone(maskPhone(value))}
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused(null)}
                placeholder="(27) 99999-9999"
                placeholderTextColor="#9aa396"
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                maxLength={15}
                accessibilityLabel="Telefone com DDD"
              />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={[styles.field, focused === 'password' && styles.fieldFocused]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={focused === 'password' ? colors.forest : colors.muted}
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                placeholder="Mínimo de 4 caracteres"
                placeholderTextColor="#9aa396"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={handleSubmit}
                accessibilityLabel="Senha"
              />
              <Pressable
                onPress={() => setShowPassword((value) => !value)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.muted} />
              </Pressable>
            </View>

            {error && (
              <View style={styles.error} accessibilityLiveRegion="polite">
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => [
                styles.button,
                !canSubmit && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
            >
              {sending ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Text style={styles.buttonText}>Entrar</Text>
                  <Ionicons name="arrow-forward" size={20} color={colors.white} />
                </>
              )}
            </Pressable>

            <View style={styles.secure}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.forest} />
              <Text style={styles.secureText}>Seus dados ficam protegidos</Text>
            </View>

            <Pressable onPress={() => Linking.openURL(ARVO_WHATSAPP)} style={styles.help} accessibilityRole="link">
              <Ionicons name="logo-whatsapp" size={22} color={colors.leaf} />
              <View style={styles.helpTexts}>
                <Text style={styles.helpText}>Esqueceu a senha ou não tem acesso?</Text>
                <Text style={styles.helpStrong}>Fale com a Arvo pelo WhatsApp</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.forest },
  scroll: { flexGrow: 1 },
  hero: { alignItems: 'center', paddingBottom: spacing.xl + spacing.md, overflow: 'hidden' },
  watermark: { position: 'absolute', opacity: 0.06, top: -40, right: -110 },
  wordmark: { marginTop: spacing.md },
  tagline: {
    fontFamily: fonts.medium,
    fontSize: font.label,
    color: colors.sand,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  },
  sheet: {
    flexGrow: 1,
    backgroundColor: colors.cream,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  form: { width: '100%', maxWidth: 440, alignSelf: 'center' },
  title: { fontFamily: fonts.bold, fontSize: font.big - 2, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: font.label, color: colors.muted, marginTop: spacing.xs, lineHeight: 21 },
  label: { fontFamily: fonts.semibold, fontSize: font.small, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  fieldFocused: { borderColor: colors.forest },
  input: { flex: 1, fontFamily: fonts.medium, fontSize: font.body + 1, color: colors.text, paddingVertical: 14, outlineStyle: 'none' } as never,
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.sm,
    padding: spacing.sm + 4,
    marginTop: spacing.md,
  },
  errorText: { flex: 1, fontFamily: fonts.medium, fontSize: font.label, color: colors.danger },
  button: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: 56,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonPressed: { backgroundColor: colors.leafDark },
  buttonText: { fontFamily: fonts.bold, fontSize: font.body + 1, color: colors.white },
  secure: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  secureText: { fontFamily: fonts.regular, fontSize: font.small, color: colors.muted },
  help: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  helpTexts: { flex: 1 },
  helpText: { fontFamily: fonts.regular, fontSize: font.small, color: colors.muted },
  helpStrong: { fontFamily: fonts.bold, fontSize: font.label, color: colors.forest, marginTop: 2 },
});
