export const onlyDigits = (value: string) => value.replace(/\D/g, '');

// Formata enquanto o produtor digita: "27999990001" → "(27) 99999-0001".
export const maskPhone = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  const split = rest.length === 9 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
};

export const isCompletePhone = (value: string) => {
  const length = onlyDigits(value).length;
  return length === 10 || length === 11;
};
