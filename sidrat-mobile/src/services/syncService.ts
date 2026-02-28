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
 * - Failed ops are retried with exponential backoff, then dead-lettered
 */

import NetInfo from '@react-native-community/netinfo';
import {
  getPendingSyncOps,
  removeSyncOp,
  incrementSyncRetry,
  purgeDeadLetterOps,
  getSyncMeta,
  setSyncMeta,
  mergeRemoteProgress,
  getLocalChildIds,
} from './localDatabase';
import { supabase } from './supabase';
import { SUPABASE_URL } from '../constants/config';

const BACKOFF_BASE_MS = 1000;
const BACKOFF_MAX_MS = 30_000;

function backoffDelay(retries: number): number {
  return Math.min(BACKOFF_BASE_MS * Math.pow(2, retries), BACKOFF_MAX_MS);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
      await purgeDeadLetterOps();
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
   * Failed operations get their retry count incremented instead of blocking the queue.
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
          const { error } = await supabase.from(op.table_name).delete().eq('id', op.record_id);
          if (error) throw error;
        }

        await removeSyncOp(op.id);
        count++;
      } catch (error) {
        console.error(
          `[Sync] Push failed for ${op.table_name}/${op.record_id} (retry ${op.retries}):`,
          error,
        );
        await incrementSyncRetry(op.id);
        // Backoff before trying next operation
        await sleep(backoffDelay(op.retries));
      }
    }

    return count;
  }

  /**
   * Pull remote changes and merge into local DB.
   * Only pulls data for the authenticated user's children.
   * Uses updated_at watermark to fetch only new changes.
   */
  private async pullChanges(): Promise<number> {
    const childIds = await getLocalChildIds();
    if (childIds.length === 0) return 0;

    const lastPull = await getSyncMeta('last_pull_at');
    let pulled = 0;

    try {
      let query = supabase
        .from('lesson_progress')
        .select('*')
        .in('child_id', childIds)
        .order('updated_at', { ascending: true })
        .limit(200);

      if (lastPull) {
        query = query.gt('updated_at', lastPull);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) return 0;

      let latestTimestamp = lastPull ?? '';

      for (const row of data) {
        const merged = await mergeRemoteProgress({
          id: row.id as string,
          child_id: row.child_id as string,
          lesson_id: row.lesson_id as string,
          is_completed: row.is_completed as boolean,
          completed_at: row.completed_at as string | null,
          score: row.score as number,
          xp_earned: row.xp_earned as number,
          attempts: row.attempts as number,
          last_completed_phase: row.last_completed_phase as string | null,
          phase_progress: JSON.stringify(row.phase_progress ?? {}),
          last_accessed_at: row.last_accessed_at as string | null,
          updated_at: row.updated_at as string,
        });
        if (merged) pulled++;

        const rowUpdated = row.updated_at as string;
        if (rowUpdated > latestTimestamp) {
          latestTimestamp = rowUpdated;
        }
      }

      if (latestTimestamp) {
        await setSyncMeta('last_pull_at', latestTimestamp);
      }
    } catch (error) {
      console.error('[Sync] Pull failed:', error);
    }

    return pulled;
  }
}

export const syncService = new SyncService();
