/**
 * Local SQLite Database
 *
 * Offline-first persistence layer. All reads/writes go through
 * local SQLite first. Remote sync happens opportunistically.
 *
 * Schema mirrors Supabase tables for seamless sync.
 * Uses WAL journal mode for best concurrent read performance.
 */

import * as SQLite from 'expo-sqlite';

const DB_NAME = 'sidrat.db';
const DB_VERSION = 2;
const MAX_SYNC_RETRIES = 5;

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Get (or create) the singleton database instance.
 * Automatically runs migrations on first open.
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;

  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await runMigrations(db);
  dbInstance = db;
  return db;
}

/**
 * Run all pending schema migrations.
 */
async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER NOT NULL
    );
  `);

  const versionRow = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1',
  );
  const currentVersion = versionRow?.version ?? 0;

  if (currentVersion < 1) {
    await migrateV1(db);
  }
  if (currentVersion < 2) {
    await migrateV2(db);
  }

  if (currentVersion === 0) {
    await db.runAsync('INSERT INTO schema_version (version) VALUES (?)', [DB_VERSION]);
  } else {
    await db.runAsync('UPDATE schema_version SET version = ?', [DB_VERSION]);
  }
}

/**
 * V1 Migration: Core tables for children, progress, achievements
 */
async function migrateV1(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS children (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      birth_year INTEGER NOT NULL,
      avatar_id TEXT NOT NULL,
      xp_total INTEGER DEFAULT 0,
      current_level INTEGER DEFAULT 1,
      streak_current INTEGER DEFAULT 0,
      streak_best INTEGER DEFAULT 0,
      total_lessons_completed INTEGER DEFAULT 0,
      last_lesson_completed_date TEXT,
      current_week_number INTEGER DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_accessed_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS lesson_progress (
      id TEXT PRIMARY KEY NOT NULL,
      child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      lesson_id TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0,
      completed_at TEXT,
      score INTEGER DEFAULT 0,
      xp_earned INTEGER DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      last_completed_phase TEXT,
      phase_progress TEXT DEFAULT '{}',
      last_accessed_at TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0,
      UNIQUE(child_id, lesson_id)
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY NOT NULL,
      child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      earned_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0,
      UNIQUE(child_id, type)
    );

    CREATE TABLE IF NOT EXISTS family_activity_progress (
      id TEXT PRIMARY KEY NOT NULL,
      child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      activity_id TEXT NOT NULL,
      completed_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0,
      UNIQUE(child_id, activity_id)
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      operation TEXT NOT NULL CHECK(operation IN ('upsert', 'delete')),
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      retries INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_progress_child ON lesson_progress(child_id);
    CREATE INDEX IF NOT EXISTS idx_progress_lesson ON lesson_progress(lesson_id);
    CREATE INDEX IF NOT EXISTS idx_achievements_child ON achievements(child_id);
    CREATE INDEX IF NOT EXISTS idx_sync_queue_table ON sync_queue(table_name);
  `);
}

/**
 * V2 Migration: Add updated_at to tables missing it, add last_synced_at tracking
 */
async function migrateV2(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_metadata (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}

/**
 * Close the database connection.
 * Call this on app background/terminate.
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
}

/**
 * Queue an operation for sync to Supabase.
 */
export async function queueSync(
  tableName: string,
  recordId: string,
  operation: 'upsert' | 'delete',
  payload: Record<string, unknown>,
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO sync_queue (table_name, record_id, operation, payload) VALUES (?, ?, ?, ?)',
    [tableName, recordId, operation, JSON.stringify(payload)],
  );
}

/**
 * Get pending sync operations that haven't exceeded the retry limit.
 */
export async function getPendingSyncOps(): Promise<
  {
    id: number;
    table_name: string;
    record_id: string;
    operation: string;
    payload: string;
    retries: number;
  }[]
> {
  const db = await getDatabase();
  return db.getAllAsync(
    'SELECT * FROM sync_queue WHERE retries < ? ORDER BY created_at ASC LIMIT 50',
    [MAX_SYNC_RETRIES],
  );
}

/**
 * Remove a sync operation after successful push.
 */
export async function removeSyncOp(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
}

/**
 * Increment the retry count for a failed sync operation.
 */
export async function incrementSyncRetry(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE sync_queue SET retries = retries + 1 WHERE id = ?', [id]);
}

/**
 * Remove dead-letter sync operations that have exceeded max retries.
 * Returns the number of removed operations.
 */
export async function purgeDeadLetterOps(): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync('DELETE FROM sync_queue WHERE retries >= ?', [MAX_SYNC_RETRIES]);
  return result.changes;
}

/**
 * Get or set a sync metadata value (e.g., last sync timestamp).
 */
export async function getSyncMeta(key: string): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM sync_metadata WHERE key = ?',
    [key],
  );
  return row?.value ?? null;
}

export async function setSyncMeta(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('INSERT OR REPLACE INTO sync_metadata (key, value) VALUES (?, ?)', [
    key,
    value,
  ]);
}

/**
 * Upsert a lesson progress row from remote data.
 * Uses "progress never decreases" merge rule.
 */
export async function mergeRemoteProgress(row: {
  id: string;
  child_id: string;
  lesson_id: string;
  is_completed: boolean;
  completed_at: string | null;
  score: number;
  xp_earned: number;
  attempts: number;
  last_completed_phase: string | null;
  phase_progress: string;
  last_accessed_at: string | null;
  updated_at: string;
}): Promise<boolean> {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<{
    score: number;
    xp_earned: number;
    is_completed: number;
    updated_at: string;
  }>(
    'SELECT score, xp_earned, is_completed, updated_at FROM lesson_progress WHERE child_id = ? AND lesson_id = ?',
    [row.child_id, row.lesson_id],
  );

  if (existing && existing.updated_at >= row.updated_at) {
    return false;
  }

  const mergedScore = Math.max(existing?.score ?? 0, row.score);
  const mergedXp = Math.max(existing?.xp_earned ?? 0, row.xp_earned);
  const mergedCompleted = (existing?.is_completed ?? 0) === 1 || row.is_completed;

  await db.runAsync(
    `INSERT INTO lesson_progress (id, child_id, lesson_id, is_completed, completed_at, score, xp_earned, attempts, last_completed_phase, phase_progress, last_accessed_at, updated_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
     ON CONFLICT(child_id, lesson_id) DO UPDATE SET
       is_completed = ?,
       completed_at = COALESCE(lesson_progress.completed_at, ?),
       score = ?,
       xp_earned = ?,
       attempts = MAX(lesson_progress.attempts, ?),
       last_completed_phase = ?,
       phase_progress = ?,
       last_accessed_at = ?,
       updated_at = ?,
       synced = 1`,
    [
      row.id,
      row.child_id,
      row.lesson_id,
      mergedCompleted ? 1 : 0,
      row.completed_at,
      mergedScore,
      mergedXp,
      row.attempts,
      row.last_completed_phase,
      row.phase_progress,
      row.last_accessed_at,
      row.updated_at,
      // ON CONFLICT values
      mergedCompleted ? 1 : 0,
      row.completed_at,
      mergedScore,
      mergedXp,
      row.attempts,
      row.last_completed_phase,
      row.phase_progress,
      row.last_accessed_at,
      row.updated_at,
    ],
  );

  return true;
}

/**
 * Get all children IDs from local database.
 */
export async function getLocalChildIds(): Promise<string[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ id: string }>('SELECT id FROM children');
  return rows.map((r) => r.id);
}
