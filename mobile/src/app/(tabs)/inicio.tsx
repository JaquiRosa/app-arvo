import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { ComingSoon, type IconName, Screen, textStyles } from '@/components/screen';
import { SignInInvite } from '@/components/sign-in-invite';
import { useProfile } from '@/hooks/use-profile';
import { colors, font, fonts, radius, shadow, spacing } from '@/theme';
import { firstName } from '@/utils/name';

// Notícias de modelo só para ver o visual. Depois vêm do MVGI, publicadas pelos admins.
type News = { id: string; category: string; title: string; date: string; icon: IconName; tone: 'leaf' | 'earth' };

const SAMPLE_NEWS: News[] = [
  {
    id: '1',
    category: 'Reflorestar',
    title: 'Novas turmas de produtores começam o plantio na região serrana',
    date: '18 nov 2026',
    icon: 'leaf',
    tone: 'leaf',
  },
  {
    id: '2',
    category: 'Café',
    title: 'Arábica sobe pela terceira semana seguida com chuva abaixo da média',
    date: '16 nov 2026',
    icon: 'cafe',
    tone: 'earth',
  },
  {
    id: '3',
    category: 'Eventos',
    title: 'Dia de campo sobre manejo de sistemas agroflorestais acontece em dezembro',
    date: '12 nov 2026',
    icon: 'people',
    tone: 'leaf',
  },
];

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Bom dia';
  }
  if (hour < 18) {
    return 'Boa tarde';
  }
  return 'Boa noite';
}

// Tela aberta: qualquer pessoa vê, com ou sem login.
// Sem login: chamada para entrar no topo. Com login: a saudação usa o nome do produtor.
export default function HomeScreen() {
  const { token } = useAuth();
  const { data: profile } = useProfile();
  const signedIn = !!token;

  let eyebrow = `${greetingForNow()}!`;
  let title = 'Portal do Produtor';
  if (profile) {
    eyebrow = `${greetingForNow()},`;
    title = firstName(profile.name);
  }

  // A chamada é um cartão branco, então pode subir por cima do cabeçalho verde.
  // Sem ela, o primeiro item é um título de seção, que precisa ficar abaixo do cabeçalho.
  return (
    <Screen eyebrow={eyebrow} title={title} overlap={!signedIn}>
      {!signedIn && <SignInInvite />}

      <Text style={[textStyles.section, signedIn && styles.firstSection]}>Para você acompanhar</Text>
      <ComingSoon title="Cotação do café" description="Preço do dia do arábica e do conilon." icon="cafe-outline" tone="earth" />
      <ComingSoon title="Clima" description="Chuva e temperatura previstas para a sua região." icon="partly-sunny-outline" />

      <Text style={textStyles.section}>Notícias</Text>
      {SAMPLE_NEWS.map((news) => (
        <NewsCard key={news.id} news={news} />
      ))}
    </Screen>
  );
}

const NEWS_TONES = {
  leaf: { image: colors.olive, category: colors.leaf },
  earth: { image: colors.earth, category: colors.earth },
};

function NewsCard({ news }: { news: News }) {
  const tone = NEWS_TONES[news.tone];
  return (
    <View style={styles.news}>
      <View style={[styles.newsImage, { backgroundColor: tone.image }]}>
        <Ionicons name={news.icon} size={30} color={colors.cream} />
      </View>
      <View style={styles.newsText}>
        <Text style={[styles.newsCategory, { color: tone.category }]}>{news.category}</Text>
        <Text style={styles.newsTitle} numberOfLines={3}>
          {news.title}
        </Text>
        <Text style={styles.newsDate}>{news.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  firstSection: { marginTop: 0 },
  news: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: 'hidden',
    minHeight: 112,
    ...shadow,
  },
  newsImage: { width: 96, alignItems: 'center', justifyContent: 'center' },
  newsText: { flex: 1, padding: spacing.md, gap: 4 },
  newsCategory: { fontFamily: fonts.semibold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 },
  newsTitle: { fontFamily: fonts.bold, fontSize: font.body, color: colors.text, lineHeight: 21 },
  newsDate: { fontFamily: fonts.regular, fontSize: font.small, color: colors.muted, marginTop: 'auto' },
});
