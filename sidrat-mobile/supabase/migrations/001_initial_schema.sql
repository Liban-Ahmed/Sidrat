-- Sidrat Mobile: Initial Supabase Schema
-- Run this in your Supabase SQL Editor after creating a project.
--
-- COPPA Compliance Notes:
-- - Parents table has minimal data (no email stored)
-- - Row Level Security ensures each parent sees only their data
-- - No PII beyond child's first name

-- ── Parents ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apple_user_id TEXT UNIQUE,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Children ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_year INTEGER NOT NULL,
  avatar_id TEXT NOT NULL,
  xp_total INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  streak_current INTEGER DEFAULT 0,
  streak_best INTEGER DEFAULT 0,
  total_lessons_completed INTEGER DEFAULT 0,
  last_lesson_completed_date TIMESTAMPTZ,
  current_week_number INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_accessed_at TIMESTAMPTZ DEFAULT now()
);

-- ── Lesson Progress ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  score INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  last_completed_phase TEXT,
  phase_progress JSONB DEFAULT '{}',
  last_accessed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(child_id, lesson_id)
);

-- ── Achievements ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(child_id, type)
);

-- ── Family Activity Progress ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS family_activity_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(child_id, activity_id)
);

-- ── Row Level Security ───────────────────────────────────────────

ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_activity_progress ENABLE ROW LEVEL SECURITY;

-- Parents: users can only access their own record
CREATE POLICY parents_own_data ON parents
  FOR ALL USING (
    id = (
      SELECT id FROM parents
      WHERE apple_user_id = auth.uid()::text
      OR (is_anonymous = true AND id = auth.uid())
    )
  );

-- Children: only parent's children
CREATE POLICY children_of_parent ON children
  FOR ALL USING (
    parent_id IN (
      SELECT id FROM parents
      WHERE apple_user_id = auth.uid()::text
      OR (is_anonymous = true AND id = auth.uid())
    )
  );

-- Progress: only for parent's children's progress
CREATE POLICY progress_of_children ON lesson_progress
  FOR ALL USING (
    child_id IN (
      SELECT c.id FROM children c
      JOIN parents p ON c.parent_id = p.id
      WHERE p.apple_user_id = auth.uid()::text
      OR (p.is_anonymous = true AND p.id = auth.uid())
    )
  );

-- Achievements: only for parent's children
CREATE POLICY achievements_of_children ON achievements
  FOR ALL USING (
    child_id IN (
      SELECT c.id FROM children c
      JOIN parents p ON c.parent_id = p.id
      WHERE p.apple_user_id = auth.uid()::text
      OR (p.is_anonymous = true AND p.id = auth.uid())
    )
  );

-- Family activities: only for parent's children
CREATE POLICY family_of_children ON family_activity_progress
  FOR ALL USING (
    child_id IN (
      SELECT c.id FROM children c
      JOIN parents p ON c.parent_id = p.id
      WHERE p.apple_user_id = auth.uid()::text
      OR (p.is_anonymous = true AND p.id = auth.uid())
    )
  );

-- ── Upsert function (progress never decreases) ──────────────────

CREATE OR REPLACE FUNCTION upsert_lesson_progress(
  p_child_id UUID,
  p_lesson_id TEXT,
  p_is_completed BOOLEAN,
  p_score INTEGER,
  p_xp_earned INTEGER,
  p_completed_at TIMESTAMPTZ DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO lesson_progress (child_id, lesson_id, is_completed, score, xp_earned, completed_at)
  VALUES (p_child_id, p_lesson_id, p_is_completed, p_score, p_xp_earned, p_completed_at)
  ON CONFLICT (child_id, lesson_id) DO UPDATE SET
    is_completed = lesson_progress.is_completed OR EXCLUDED.is_completed,
    score = GREATEST(lesson_progress.score, EXCLUDED.score),
    xp_earned = GREATEST(lesson_progress.xp_earned, EXCLUDED.xp_earned),
    completed_at = COALESCE(lesson_progress.completed_at, EXCLUDED.completed_at),
    attempts = lesson_progress.attempts + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Indices ──────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_children_parent ON children(parent_id);
CREATE INDEX IF NOT EXISTS idx_progress_child ON lesson_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_achievements_child ON achievements(child_id);
