export const onlyDigits = (value: string) => value.replace(/\D/g, '');

// Formata enquanto o produtor digita: "27999990001" → "(27) 99999-0001".
export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length === 0) {
    return '';
  }
  if (digits.length <= 2) {
    return `(${digits}`;
  }

  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);
  if (number.length <= 4) {
    return `(${ddd}) ${number}`;
  }

  // Celular tem 9 dígitos (99999-0001); fixo tem 8 (3333-0001).
  const isMobile = number.length === 9;
  const firstPartLength = isMobile ? 5 : 4;
  const firstPart = number.slice(0, firstPartLength);
  const lastPart = number.slice(firstPartLength);
  return `(${ddd}) ${firstPart}-${lastPart}`;
}

// DDD + 8 dígitos (fixo) ou DDD + 9 dígitos (celular).
export function isCompletePhone(value: string): boolean {
  const length = onlyDigits(value).length;
  return length === 10 || length === 11;
}
