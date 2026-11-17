// Identidade visual da Arvo: verde-floresta do logo, creme de fundo, terra/marrom e o verde vivo do painel MVGI.
export const colors = {
  forest: '#395237',
  forestDark: '#2a3d28',
  forestDeep: '#1e2e1c',
  leaf: '#1c8e36',
  leafSoft: '#e4efe1',
  olive: '#586c32',
  earth: '#7a4522',
  earthSoft: '#f3e6d6',
  sand: '#c99a66',
  cream: '#f4f1e5',
  creamDark: '#ebe6d6',
  line: '#e2ddcc',
  text: '#1e2e1c',
  muted: '#5f6b5c',
  white: '#ffffff',
  danger: '#b3261e',
  dangerSoft: '#f8e1de',
} as const;

export const fonts = {
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;

// Fontes grandes: muitos produtores leem o celular no campo, ao sol.
export const font = { small: 13, label: 15, body: 16, title: 20, big: 28 } as const;

export const shadow = {
  shadowColor: '#1e2e1c',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
} as const;
