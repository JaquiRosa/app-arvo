import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'arvo.accessToken';

// No celular o token fica no armazenamento seguro do sistema.
// O navegador (usado só para testar) não tem esse recurso, então usa localStorage.
const isWeb = Platform.OS === 'web';

export const sessionStorage = {
  async getToken(): Promise<string | null> {
    if (isWeb) return globalThis.localStorage?.getItem(TOKEN_KEY) ?? null;
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async setToken(token: string): Promise<void> {
    if (isWeb) return globalThis.localStorage?.setItem(TOKEN_KEY, token);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async clear(): Promise<void> {
    if (isWeb) return globalThis.localStorage?.removeItem(TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};
