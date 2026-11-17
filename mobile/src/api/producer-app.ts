import { apiRequest } from './client';

// Espelham os tipos de mvgi-backend/src/domain/models/producer-app.model.ts.
export type ProjectStatus = 'executing' | 'canceled' | 'archived';

export interface ProducerProject {
  id: string;
  contractNumber: string;
  status: ProjectStatus;
  program: string;
  stage: { id: string; name: string; order: number | null } | null;
}

export interface ProducerProperty {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  community: string | null;
  watershed: string | null;
  totalArea: number | null;
  latitude: number | null;
  longitude: number | null;
  projects: ProducerProject[];
}

export interface ProducerProfile {
  id: string;
  name: string;
  phone: string | null;
  properties: ProducerProperty[];
}

export const loginWithPhone = (phone: string, password: string) =>
  apiRequest<{ accessToken: string }>('/app/login', { method: 'POST', body: { phone, password } });

export const getMyProfile = (token: string) => apiRequest<ProducerProfile>('/app/me', { token });
