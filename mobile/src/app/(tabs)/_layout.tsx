import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { type ColorValue, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-context';
import type { IconName } from '@/components/screen';
import { SelectedPropertyProvider } from '@/hooks/selected-property';
import { colors, fonts } from '@/theme';

// Ícone cheio + fundo verde-claro na aba ativa, contorno nas demais.
const tabIcon = (outline: IconName, filled: IconName) =>
  function TabIcon({ color, focused }: { color: ColorValue; focused: boolean; size: number }) {
    return (
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <Ionicons name={focused ? filled : outline} color={color as string} size={22} />
      </View>
    );
  };

export default function TabsLayout() {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const projectTab = token ? PROJECT_TAB_OPEN : PROJECT_TAB_LOCKED;

  return (
    <SelectedPropertyProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.forest,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.line,
            height: 70 + insets.bottom,
            paddingTop: 8,
            paddingBottom: 8 + insets.bottom,
          },
          // "Propriedade" é o rótulo mais longo; com Montserrat precisa de 10,5px para caber em 375px.
          tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 10.5, letterSpacing: -0.3, marginTop: 2 },
          tabBarItemStyle: { paddingHorizontal: 0 },
          sceneStyle: { backgroundColor: colors.cream },
        }}
      >
        <Tabs.Screen name="inicio" options={{ title: 'Início', tabBarIcon: tabIcon('home-outline', 'home') }} />
        <Tabs.Screen
          name="propriedade"
          options={{ title: 'Propriedade', tabBarIcon: tabIcon('leaf-outline', 'leaf') }}
        />
        <Tabs.Screen
          name="projeto"
          options={projectTab.options}
          listeners={{
            tabPress: (event) => {
              if (projectTab.locked) {
                event.preventDefault();
              }
            },
          }}
        />
        <Tabs.Screen name="aprender" options={{ title: 'Aprender', tabBarIcon: tabIcon('book-outline', 'book') }} />
        <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: tabIcon('person-outline', 'person') }} />
      </Tabs>
    </SelectedPropertyProvider>
  );
}

// Projeto só tem dados pessoais: sem login a aba fica apagada, com cadeado, e não abre ao tocar.
const PROJECT_TAB_OPEN = {
  locked: false,
  options: {
    title: 'Projeto',
    tabBarIcon: tabIcon('clipboard-outline', 'clipboard'),
    tabBarAccessibilityLabel: 'Projeto',
  },
};

const PROJECT_TAB_LOCKED = {
  locked: true,
  options: {
    title: 'Projeto',
    tabBarIcon: tabIcon('lock-closed-outline', 'lock-closed'),
    tabBarAccessibilityLabel: 'Projeto, entre na sua conta para abrir',
    tabBarItemStyle: { opacity: 0.4 },
  },
};

const styles = StyleSheet.create({
  iconWrap: { width: 52, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: colors.leafSoft },
});
