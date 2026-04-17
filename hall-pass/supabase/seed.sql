-- Seed data for Hall Pass

-- Note: This is sample data. In production, NPC data is handled client-side
-- and player-specific data is created on user registration.

-- Example: Create a test player (for development only)
INSERT INTO player_profiles (user_id, name, archetype, year)
VALUES (
    '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
    'Test Player',
    'hybrid',
    1
)
ON CONFLICT (user_id) DO NOTHING;
