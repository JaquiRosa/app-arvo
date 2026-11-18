import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ProducerProject, ProducerProperty } from '@/api/producer-app';
import { useAuth } from '@/auth/auth-context';
import { LoginPanel } from '@/components/login-panel';
import { PropertyPicker } from '@/components/property-picker';
import { Card, ComingSoon, InfoRow, Screen, textStyles } from '@/components/screen';
import { StageProgress } from '@/components/stage-progress';
import { useSelectedProperty } from '@/hooks/selected-property';
import { useProfile } from '@/hooks/use-profile';
import { colors, font, fonts, radius, spacing } from '@/theme';
import { firstName } from '@/utils/name';

// Os dados desta aba são pessoais: sem login ela mostra o login no lugar.
export default function PropertyScreen() {
  const { token } = useAuth();
  if (!token) {
    return <LoginPanel />;
  }
  return <MyProperty />;
}

function MyProperty() {
  const { data: profile, isLoading, error, refetch } = useProfile();
  const { property } = useSelectedProperty();

  if (isLoading) {
    return (
      <ProfileStatus>
        <ActivityIndicator color={colors.forest} size="large" />
      </ProfileStatus>
    );
  }

  if (!profile) {
    const message = error?.message ?? 'Não foi possível carregar seus dados.';
    return (
      <ProfileStatus>
        <Text style={textStyles.body}>{message}</Text>
        <Pressable onPress={() => refetch()} accessibilityRole="button">
          <Text style={styles.link}>Tentar de novo</Text>
        </Pressable>
      </ProfileStatus>
    );
  }

  return (
    <Screen eyebrow={`Olá, ${firstName(profile.name)}`} title="Minha propriedade" header={<PropertyPicker />}>
      {property ? <PropertyOverview property={property} /> : <NoProjectFound />}

      <ComingSoon
        title="Próximas atividades"
        description="O que fazer na sua área nas próximas semanas."
        icon="calendar-outline"
      />
      <ComingSoon
        title="Áreas de intervenção"
        description="Cada área do projeto com modalidade, tamanho e culturas."
        icon="grid-outline"
      />
      <ComingSoon title="Localização" description="Mapa com o ponto da propriedade e o caminho até ela." icon="map-outline" tone="earth" />
    </Screen>
  );
}

// Enquanto o perfil carrega, ou se der erro, a tela mostra só este cartão.
function ProfileStatus({ children }: { children: ReactNode }) {
  return (
    <Screen eyebrow="Minha propriedade" title="Propriedade">
      <Card>{children}</Card>
    </Screen>
  );
}

function PropertyOverview({ property }: { property: ProducerProperty }) {
  return (
    <>
      <PropertyHeader property={property} />
      {property.projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <TotalArea hectares={property.totalArea} />
      <Card title="Dados da propriedade" icon="document-text-outline">
        <InfoRow label="Município" value={cityAndState(property) ?? '—'} />
        <InfoRow label="Comunidade" value={property.community ?? '—'} />
        <InfoRow label="Bacia hidrográfica" value={property.watershed ?? '—'} />
      </Card>
    </>
  );
}

function PropertyHeader({ property }: { property: ProducerProperty }) {
  const location = describeLocation(property);
  return (
    <View style={styles.propertyCard}>
      <View style={styles.propertyIcon}>
        <Ionicons name="home" size={22} color={colors.cream} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.propertyName}>{property.name}</Text>
        {location !== '' && <Text style={textStyles.muted}>{location}</Text>}
      </View>
    </View>
  );
}

const PROJECT_STATUS: Record<ProducerProject['status'], { label: string; color: string; background: string }> = {
  executing: { label: 'Em andamento', color: colors.leaf, background: colors.leafSoft },
  canceled: { label: 'Cancelado', color: colors.danger, background: colors.dangerSoft },
  archived: { label: 'Encerrado', color: colors.earth, background: colors.earthSoft },
};

function ProjectCard({ project }: { project: ProducerProject }) {
  const status = PROJECT_STATUS[project.status];
  const stageOrder = project.stage?.order ?? null;
  return (
    <Card>
      <View style={styles.projectHeader}>
        <View style={styles.flex}>
          <Text style={textStyles.section}>{project.program}</Text>
          <Text style={styles.contract}>Contrato nº {project.contractNumber}</Text>
        </View>
        <Text style={[styles.status, { color: status.color, backgroundColor: status.background }]}>{status.label}</Text>
      </View>
      <StageProgress currentOrder={stageOrder} />
    </Card>
  );
}

function TotalArea({ hectares }: { hectares: number | null }) {
  let text = '—';
  if (hectares !== null) {
    text = `${hectares.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ha`;
  }
  return (
    <View style={styles.highlight}>
      <Text style={styles.highlightLabel}>Área total</Text>
      <Text style={styles.highlightValue}>{text}</Text>
    </View>
  );
}

function NoProjectFound() {
  return (
    <Card title="Nenhum projeto encontrado" icon="information-circle-outline">
      <Text style={textStyles.body}>
        Não achamos projeto do Reflorestar no seu cadastro. Fale com a Arvo se isso estiver errado.
      </Text>
    </Card>
  );
}

// "Castelo/ES". Quando o estado não vem do cadastro, assume ES (o Reflorestar é do Espírito Santo).
function cityAndState(property: ProducerProperty): string | null {
  if (!property.city) {
    return null;
  }
  const state = property.state ?? 'ES';
  return `${property.city}/${state}`;
}

// "Patrimônio do Ouro · Castelo/ES", pulando o que não estiver cadastrado.
function describeLocation(property: ProducerProperty): string {
  const parts: string[] = [];
  if (property.community) {
    parts.push(property.community);
  }
  const city = cityAndState(property);
  if (city) {
    parts.push(city);
  }
  return parts.join(' · ');
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
  highlight: {
    backgroundColor: colors.olive,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highlightLabel: { fontFamily: fonts.medium, fontSize: 15, color: colors.cream },
  highlightValue: { fontFamily: fonts.bold, fontSize: 24, color: colors.cream },
});
