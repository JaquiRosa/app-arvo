import { StyleSheet, Text, View } from 'react-native';

import { PropertyPicker } from '@/components/property-picker';
import { Card, ComingSoon, InfoRow, Screen } from '@/components/screen';
import { useSelectedProperty } from '@/hooks/selected-property';
import { colors, fonts, radius, spacing } from '@/theme';

const hectares = (value: number | null) =>
  value === null ? '—' : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ha`;

export default function PropertyScreen() {
  const { property } = useSelectedProperty();

  return (
    <Screen eyebrow="Minha propriedade" title={property?.name ?? 'Propriedade'} header={<PropertyPicker />}>
      {property && (
        <>
          <View style={styles.highlight}>
            <Text style={styles.highlightLabel}>Área total</Text>
            <Text style={styles.highlightValue}>{hectares(property.totalArea)}</Text>
          </View>
          <Card title="Dados da propriedade" icon="document-text-outline">
            <InfoRow label="Município" value={property.city ? `${property.city}/${property.state ?? 'ES'}` : '—'} />
            <InfoRow label="Comunidade" value={property.community ?? '—'} />
            <InfoRow label="Bacia hidrográfica" value={property.watershed ?? '—'} />
          </Card>
        </>
      )}
      <ComingSoon
        title="Áreas de intervenção"
        description="Cada área do projeto com modalidade, tamanho e culturas."
        icon="grid-outline"
      />
      <ComingSoon title="Localização" description="Mapa com o ponto da propriedade e o caminho até ela." icon="map-outline" tone="earth" />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
