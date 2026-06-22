import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { LIGHT, DARK } from '../constants/colors';

export function useTheme() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const colors = isDark ? DARK : LIGHT;
  return { isDark, toggleTheme, colors };
}
