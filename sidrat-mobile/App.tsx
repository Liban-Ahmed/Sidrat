/**
 * App.tsx is no longer the entry point.
 * Expo Router uses app/_layout.tsx as the root.
 * Entry is configured in package.json → "main": "expo-router/entry"
 *
 * This file is kept for backwards compatibility only.
 */

export { default } from 'expo-router/build/qualified-entry';

