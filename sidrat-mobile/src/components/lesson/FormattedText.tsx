/**
 * FormattedText — Renders text with **bold** markdown syntax properly styled.
 *
 * Parses `**text**` patterns and renders bold segments with fontWeight 700.
 * Falls back to a plain <Text> for strings without markdown.
 */

import React from 'react';
import { Text, type TextStyle, type StyleProp } from 'react-native';

interface FormattedTextProps {
  children: string;
  style?: StyleProp<TextStyle>;
  /** Extra style applied only to **bold** segments */
  boldStyle?: StyleProp<TextStyle>;
  /** Maximum number of lines to display */
  numberOfLines?: number;
}

const BOLD_RE = /(\*\*[^*]+\*\*)/g;

export function FormattedText({ children, style, boldStyle, numberOfLines }: FormattedTextProps) {
  if (!children || typeof children !== 'string') {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {children}
      </Text>
    );
  }

  const parts = children.split(BOLD_RE);

  // Fast path — no bold markers found
  if (parts.length === 1) {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {children}
      </Text>
    );
  }

  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={i} style={[{ fontWeight: '700' }, boldStyle]}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </Text>
  );
}
