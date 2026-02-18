-- Seed data for development/testing
-- Only runs in development environment

-- Demo parent (anonymous)
INSERT INTO parents (id, is_anonymous, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', true, now())
ON CONFLICT DO NOTHING;

-- Demo child
INSERT INTO children (id, parent_id, name, birth_year, avatar_id, xp_total, streak_current, streak_best, total_lessons_completed, current_week_number)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Yusuf', 2019, 'lion', 120, 3, 5, 8, 2)
ON CONFLICT DO NOTHING;
