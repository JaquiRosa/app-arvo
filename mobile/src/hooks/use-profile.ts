import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { ApiError } from '@/api/client';
import { getMyProfile } from '@/api/producer-app';
import { useAuth } from '@/auth/auth-context';

// Respostas do mvgi-backend que significam que a sessão não vale mais
// (nomes do enum HttpStatusCodes de lá): 401 UNAUTHORIZED, 402 MISSING_PERMISSIONS, 455 LOGIN_FAILED.
const SESSION_ENDED_STATUSES = [401, 402, 455];

export function useProfile() {
  const { token, signOut } = useAuth();
  const query = useQuery({
    queryKey: ['me', token],
    queryFn: () => getMyProfile(token as string),
    enabled: !!token,
  });

  // Sessão encerrada: sai da conta e a aba Propriedade volta a mostrar o login.
  const sessionEnded = query.error instanceof ApiError && SESSION_ENDED_STATUSES.includes(query.error.status);
  useEffect(() => {
    if (sessionEnded) {
      signOut();
    }
  }, [sessionEnded, signOut]);

  return query;
}
