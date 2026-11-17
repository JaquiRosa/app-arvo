import { ComingSoon, Screen } from '@/components/screen';

export default function LearnScreen() {
  return (
    <Screen eyebrow="Academia do produtor" title="Aprender" overlap={false}>
      <ComingSoon title="Biblioteca" description="Cartilhas e folders para ler mesmo sem internet." icon="library-outline" />
      <ComingSoon title="Vídeos" description="Vídeos curtos sobre plantio e manejo." icon="play-circle-outline" tone="earth" />
      <ComingSoon title="Eventos" description="Dias de campo, oficinas e reuniões na sua região." icon="people-outline" />
    </Screen>
  );
}
