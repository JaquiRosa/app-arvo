import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ProducerProject } from '@/api/producer-app';
import { PropertyPicker } from '@/components/property-picker';
import { Card, ComingSoon, Screen, textStyles } from '@/components/screen';
import { StageProgress } from '@/components/stage-progress';
import { useSelectedProperty } from '@/hooks/selected-property';
import { useProfile } from '@/hooks/use-profile';
import { colors, font, fonts, radius, spacing } from '@/theme';

const STATUS: Record<ProducerProject['status'], { label: string; color: string; background: string }> = {
  executing: { label: 'Em andamento', color: colors.leaf, background: colors.leafSoft },
  canceled: { label: 'Cancelado', color: colors.danger, background: colors.dangerSoft },
  archived: { label: 'Encerrado', color: colors.earth, background: colors.earthSoft },
};

const firstName = (name: string) => name.split(' ')[0];

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

export default function HomeScreen() {
  const { data: profile, isLoading, error, refetch } = useProfile();
  const { property } = useSelectedProperty();

  if (isLoading || error || !profile) {
    return (
      <Screen title="Início">
        <Card>
          {isLoading ? (
            <ActivityIndicator color={colors.forest} size="large" />
          ) : (
            <>
              <Text style={textStyles.body}>{error?.message ?? 'Não foi possível carregar seus dados.'}</Text>
              <Pressable onPress={() => refetch()} accessibilityRole="button">
                <Text style={styles.link}>Tentar de novo</Text>
              </Pressable>
            </>
          )}
        </Card>
      </Screen>
    );
  }

  const location = property
    ? [property.community, property.city && `${property.city}/${property.state ?? 'ES'}`].filter(Boolean).join(' · ')
    : '';

  return (
    <Screen eyebrow={`${greeting()},`} title={firstName(profile.name)} header={<PropertyPicker />}>
      {property ? (
        <>
          <View style={styles.propertyCard}>
            <View style={styles.propertyIcon}>
              <Ionicons name="home" size={22} color={colors.cream} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.propertyName}>{property.name}</Text>
              {!!location && <Text style={textStyles.muted}>{location}</Text>}
            </View>
          </View>

          {property.projects.map((project) => {
            const status = STATUS[project.status];
            return (
              <Card key={project.id}>
                <View style={styles.projectHeader}>
                  <View style={styles.flex}>
                    <Text style={textStyles.section}>{project.program}</Text>
                    <Text style={styles.contract}>Contrato nº {project.contractNumber}</Text>
                  </View>
                  <Text style={[styles.status, { color: status.color, backgroundColor: status.background }]}>
                    {status.label}
                  </Text>
                </View>
                <StageProgress currentOrder={project.stage?.order ?? null} />
              </Card>
            );
          })}
        </>
      ) : (
        <Card title="Nenhum projeto encontrado" icon="information-circle-outline">
          <Text style={textStyles.body}>
            Não achamos projeto do Reflorestar no seu cadastro. Fale com a Arvo se isso estiver errado.
          </Text>
        </Card>
      )}

      <Text style={textStyles.section}>Para você acompanhar</Text>
      <ComingSoon title="Cotação do café" description="Preço do dia do arábica e do conilon." icon="cafe-outline" tone="earth" />
      <ComingSoon title="Clima" description="Chuva e temperatura previstas para a sua propriedade." icon="partly-sunny-outline" />
      <ComingSoon title="Próximas atividades" description="O que fazer na sua área nas próximas semanas." icon="calendar-outline" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  link: { fontFamily: fonts.bold, color: colors.forest, fontSize: font.body },
  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    shadowColor: '#1e2e1c',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  propertyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.olive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyName: { fontFamily: fonts.bold, fontSize: font.body + 1, color: colors.text },
  projectHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  contract: { fontFamily: fonts.bold, fontSize: font.title, color: colors.text, marginTop: 2 },
  status: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
});
