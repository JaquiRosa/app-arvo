import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { ApiError } from '@/api/client';
import { getMyProfile } from '@/api/producer-app';
import { useAuth } from '@/auth/auth-context';

export function useProfile() {
  const { token, signOut } = useAuth();
  const query = useQuery({
    queryKey: ['me', token],
    queryFn: () => getMyProfile(token as string),
    enabled: !!token,
  });

  // Token vencido ou acesso removido: volta para o login.
  const status = query.error instanceof ApiError ? query.error.status : null;
  useEffect(() => {
    if (status === 455 || status === 402 || status === 401) signOut();
  }, [status, signOut]);

  return query;
}
