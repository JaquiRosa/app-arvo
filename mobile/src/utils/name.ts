// "Maria da Silva" → "Maria". Usado nas saudações.
export function firstName(fullName: string): string {
  const parts = fullName.trim().split(' ');
  return parts[0];
}
