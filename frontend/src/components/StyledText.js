import React from 'react';
import { Text } from 'react-native';

const FONT_MAP = {
  '400': 'Poppins_400Regular',
  '500': 'Poppins_500Medium',
  '600': 'Poppins_600SemiBold',
  '700': 'Poppins_700Bold',
  '800': 'Poppins_800ExtraBold',
};

export function StyledText({ children, style, weight = '400', ...props }) {
  return (
    <Text style={[{ fontFamily: FONT_MAP[weight] || FONT_MAP['400'] }, style]} {...props}>
      {children}
    </Text>
  );
}
