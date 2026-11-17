import { Image, type ImageStyle, type StyleProp } from 'react-native';

import { colors } from '@/theme';

// PNGs transparentes da Arvo; tintColor recolore para usar sobre fundo verde ou creme.
const symbol = require('../../assets/simbolo.png');
const wordmark = require('../../assets/assinatura.png');

type Props = { color?: string; size: number; style?: StyleProp<ImageStyle> };

export function ArvoSymbol({ color = colors.cream, size, style }: Props) {
  return (
    <Image
      source={symbol}
      style={[{ width: size, height: size * (745 / 737), tintColor: color }, style]}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );
}

export function ArvoWordmark({ color = colors.cream, size, style }: Props) {
  return (
    <Image
      source={wordmark}
      style={[{ width: size, height: size * (403 / 1627), tintColor: color }, style]}
      resizeMode="contain"
      accessibilityLabel="Arvo"
    />
  );
}
