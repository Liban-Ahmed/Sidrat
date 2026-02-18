/**
 * useAppFonts — loads custom fonts (Amiri Arabic) via expo-font.
 *
 * Call at app root so fonts are available everywhere.
 * Returns { fontsLoaded, fontError } to gate rendering.
 */

import { useFonts } from 'expo-font';

export function useAppFonts() {
    const [fontsLoaded, fontError] = useFonts({
        'Amiri-Regular': require('../../assets/fonts/Amiri-Regular.ttf'),
        'Amiri-Bold': require('../../assets/fonts/Amiri-Bold.ttf'),
    });

    return { fontsLoaded, fontError };
}
