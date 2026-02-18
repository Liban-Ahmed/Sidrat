/**
 * Sync Service
 *
 * Handles bidirectional sync between local SQLite and Supabase.
 *
 * Strategy:
 * - Writes always go to local SQLite first
 * - Queue entries are pushed to Supabase when online
 * - Pull remote changes and merge (progress never decreases)
 * - Conflict resolution: keep the highest/latest value
 */

import NetInfo from '@react-native-community/netinfo';
import { supabase } from './supabase';
import { getPendingSyncOps, removeSyncOp } from './localDatabase';
import { SUPABASE_URL } from '../constants/config';

class SyncService {
    private isSyncing = false;
    private unsubscribeNetInfo: (() => void) | null = null;

    /**
     * Start listening for connectivity changes.
     * When back online, automatically attempt sync.
     */
    startListening(): void {
        this.unsubscribeNetInfo = NetInfo.addEventListener((state) => {
            if (state.isConnected && !this.isSyncing) {
                this.sync().catch(console.error);
            }
        });
    }

    /**
     * Stop listening for connectivity changes.
     */
    stopListening(): void {
        this.unsubscribeNetInfo?.();
        this.unsubscribeNetInfo = null;
    }

    /**
     * Check if we're currently online.
     */
    async isOnline(): Promise<boolean> {
        const state = await NetInfo.fetch();
        return !!state.isConnected;
    }

    /**
     * Run a full sync cycle: push local changes, then pull remote.
     */
    async sync(): Promise<{ pushed: number; pulled: number }> {
        // Skip sync if no Supabase URL configured
        if (!SUPABASE_URL) {
            return { pushed: 0, pulled: 0 };
        }

        if (this.isSyncing) return { pushed: 0, pulled: 0 };

        const online = await this.isOnline();
        if (!online) return { pushed: 0, pulled: 0 };

        this.isSyncing = true;
        let pushed = 0;
        let pulled = 0;

        try {
            pushed = await this.pushChanges();
            pulled = await this.pullChanges();
        } catch (error) {
            console.error('[Sync] Error during sync:', error);
        } finally {
            this.isSyncing = false;
        }

        return { pushed, pulled };
    }

    /**
     * Push all pending local changes to Supabase.
     */
    private async pushChanges(): Promise<number> {
        const ops = await getPendingSyncOps();
        let count = 0;

        for (const op of ops) {
            try {
                const payload = JSON.parse(op.payload) as Record<string, unknown>;

                if (op.operation === 'upsert') {
                    const { error } = await supabase.from(op.table_name).upsert(payload);
                    if (error) throw error;
                } else if (op.operation === 'delete') {
                    const { error } = await supabase
                        .from(op.table_name)
                        .delete()
                        .eq('id', op.record_id);
                    if (error) throw error;
                }

                await removeSyncOp(op.id);
                count++;
            } catch (error) {
                console.error(`[Sync] Push failed for ${op.table_name}/${op.record_id}:`, error);
                // Stop on first failure to maintain ordering
                break;
            }
        }

        return count;
    }

    /**
     * Pull remote changes and merge into local DB.
     * Only pulls data for the authenticated user.
     */
    private async pullChanges(): Promise<number> {
        // TODO: Implement pull logic once Supabase tables are provisioned
        // This will:
        //   1. Query lesson_progress for the authenticated user's children
        //   2. Compare updated_at timestamps
        //   3. Merge using "progress never decreases" rule
        //   4. Update local SQLite
        return 0;
    }
}

export const syncService = new SyncService();
