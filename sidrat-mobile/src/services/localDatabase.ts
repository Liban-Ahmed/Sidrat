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
const DB_VERSION = 1;

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
    // Enable WAL mode and foreign keys
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

    // Version tracking
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

    // Upsert version
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
    -- Children profiles (stored locally, synced to Supabase)
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
      synced INTEGER DEFAULT 0
    );

    -- Lesson progress (per-child, per-lesson)
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
      synced INTEGER DEFAULT 0,
      UNIQUE(child_id, lesson_id)
    );

    -- Achievements earned by children
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY NOT NULL,
      child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      earned_at TEXT NOT NULL DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0,
      UNIQUE(child_id, type)
    );

    -- Family activity completions
    CREATE TABLE IF NOT EXISTS family_activity_progress (
      id TEXT PRIMARY KEY NOT NULL,
      child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      activity_id TEXT NOT NULL,
      completed_at TEXT NOT NULL DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0,
      UNIQUE(child_id, activity_id)
    );

    -- Sync queue: pending changes to push to Supabase
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      operation TEXT NOT NULL CHECK(operation IN ('upsert', 'delete')),
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      retries INTEGER DEFAULT 0
    );

    -- Settings (key-value store)
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    -- Indices for common queries
    CREATE INDEX IF NOT EXISTS idx_progress_child ON lesson_progress(child_id);
    CREATE INDEX IF NOT EXISTS idx_progress_lesson ON lesson_progress(lesson_id);
    CREATE INDEX IF NOT EXISTS idx_achievements_child ON achievements(child_id);
    CREATE INDEX IF NOT EXISTS idx_sync_queue_table ON sync_queue(table_name);
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
 * Get all pending sync operations.
 */
export async function getPendingSyncOps(): Promise<
    Array<{
        id: number;
        table_name: string;
        record_id: string;
        operation: string;
        payload: string;
        retries: number;
    }>
> {
    const db = await getDatabase();
    return db.getAllAsync(
        'SELECT * FROM sync_queue ORDER BY created_at ASC LIMIT 50',
    );
}

/**
 * Remove a sync operation after successful push.
 */
export async function removeSyncOp(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
}
