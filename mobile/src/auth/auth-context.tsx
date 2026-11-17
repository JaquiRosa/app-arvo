import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { loginWithPhone } from '@/api/producer-app';
import { sessionStorage } from './session-storage';

type AuthState = {
  token: string | null;
  isLoading: boolean;
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ao abrir o app, recupera a sessão salva para o produtor não digitar a senha toda vez.
  useEffect(() => {
    sessionStorage
      .getToken()
      .then(setToken)
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(async (phone: string, password: string) => {
    const { accessToken } = await loginWithPhone(phone, password);
    await sessionStorage.setToken(accessToken);
    setToken(accessToken);
  }, []);

  const signOut = useCallback(async () => {
    await sessionStorage.clear();
    setToken(null);
  }, []);

  const value = useMemo(() => ({ token, isLoading, signIn, signOut }), [token, isLoading, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  return context;
}
