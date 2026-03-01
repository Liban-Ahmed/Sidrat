/**
 * useOasisColors — Returns the correct Oasis semantic color map
 * based on the current theme mode (light/dark).
 *
 * Usage:
 *   const oasis = useOasisColors();
 *   <View style={{ backgroundColor: oasis.background }} />
 */

import { useTheme } from '../theme';
import { tokens, semanticColors, darkSemanticColors, type SemanticColorMap } from '../theme/tokens';

interface OasisTheme {
  /** Full semantic color map (light or dark) */
  colors: SemanticColorMap;
  /** Raw Oasis tokens for direct access */
  t: typeof tokens.color;
  /** Whether dark mode is active */
  isDark: boolean;
}

export function useOasisColors(): OasisTheme {
  const { isDark } = useTheme();
  return {
    colors: isDark ? darkSemanticColors : semanticColors,
    t: tokens.color,
    isDark,
  };
}
