import { PropertyPicker } from '@/components/property-picker';
import { ComingSoon, Screen } from '@/components/screen';

export default function ProjectScreen() {
  return (
    <Screen eyebrow="Reflorestar" title="Meu projeto" header={<PropertyPicker />}>
      <ComingSoon
        title="Etapas do projeto"
        description="Elaboração, implantação e monitoramento, com o que já foi feito."
        icon="git-commit-outline"
      />
      <ComingSoon
        title="Atividades e cronograma"
        description="Atividades de cada etapa e o que acontece em cada ano."
        icon="calendar-outline"
      />
      <ComingSoon title="Parcelas" description="Datas e valores das parcelas, pagas e a receber." icon="cash-outline" tone="earth" />
    </Screen>
  );
}
