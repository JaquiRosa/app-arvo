import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { ArvoSymbol } from '@/components/brand';
import { colors } from '@/theme';

export default function Index() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24, backgroundColor: colors.forest }}>
        <ArvoSymbol size={88} />
        <ActivityIndicator color={colors.cream} />
      </View>
    );
  }
  return <Redirect href={token ? '/inicio' : '/login'} />;
}
