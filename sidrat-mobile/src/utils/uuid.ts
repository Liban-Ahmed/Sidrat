/**
 * Secure UUID v4 generator using expo-crypto.
 *
 * Replaces Math.random()-based UUIDs to prevent collisions,
 * especially important for IDs that sync to Supabase.
 */

import * as Crypto from 'expo-crypto';

export function uuid(): string {
    return Crypto.randomUUID();
}
