// Endereço do mvgi-backend. Em celular físico, use o IP do computador na rede (ex.: http://192.168.0.10:3000/api).
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const NETWORK_ERROR = 'Sem conexão com a Arvo. Verifique a internet e tente de novo.';

type RequestOptions = { method?: 'GET' | 'POST'; body?: unknown; token?: string | null };

export async function apiRequest<T>(path: string, { method = 'GET', body, token }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let requestBody: string | undefined;
  if (body !== undefined) {
    requestBody = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { method, headers, body: requestBody });
  } catch {
    // fetch só falha assim quando não chega no servidor (sem internet, backend fora do ar).
    throw new ApiError(0, NETWORK_ERROR);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, errorMessage(data));
  }
  return data as T;
}

// O backend devolve { message } ou, em erro de validação, { bodyExceptions: [{ message }] }.
function errorMessage(data: unknown): string {
  if (data && typeof data === 'object') {
    const { message, bodyExceptions } = data as { message?: string; bodyExceptions?: { message?: string }[] };
    if (message) return message;
    if (bodyExceptions?.[0]?.message) return bodyExceptions[0].message;
  }
  return 'Algo deu errado. Tente de novo em instantes.';
}
