-- Supabase schema for Hall Pass game

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Player profiles table
CREATE TABLE player_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar TEXT DEFAULT 'default',
    archetype TEXT NOT NULL CHECK (archetype IN ('jock', 'nerd', 'popular', 'goth', 'artist', 'rebel', 'hybrid')),
    secondary_archetype TEXT CHECK (secondary_archetype IN ('jock', 'nerd', 'popular', 'goth', 'artist', 'rebel', 'hybrid')),
    stats JSONB NOT NULL DEFAULT '{"athletic": 10, "knowledge": 10, "social": 10, "creative": 10, "cool": 100, "reputation": 0}',
    year INTEGER NOT NULL DEFAULT 1 CHECK (year BETWEEN 1 AND 4),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Room data table
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
    walls JSONB NOT NULL DEFAULT '[]',
    floor_items JSONB NOT NULL DEFAULT '[]',
    wall_items JSONB NOT NULL DEFAULT '[]',
    lighting JSONB NOT NULL DEFAULT '{}',
    layout_version INTEGER DEFAULT 1,
    last_modified TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_id)
);

-- NPC relationships table
CREATE TABLE npc_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
    npc_id TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'stranger',
    memories JSONB NOT NULL DEFAULT '[]',
    last_interaction TIMESTAMPTZ,
    UNIQUE(player_id, npc_id)
);

-- Currency/inventory table
CREATE TABLE player_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
    cool_points INTEGER NOT NULL DEFAULT 0,
    hall_passes INTEGER NOT NULL DEFAULT 0,
    archetype_points JSONB NOT NULL DEFAULT '{}',
    unlocked_items JSONB NOT NULL DEFAULT '[]',
    unlocked_outfits JSONB NOT NULL DEFAULT '["default"]',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_id)
);

-- Purchase history table
CREATE TABLE purchase_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    platform TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meta/progress table
CREATE TABLE player_meta (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
    last_login TIMESTAMPTZ DEFAULT NOW(),
    streak_days INTEGER DEFAULT 1,
    total_play_time INTEGER DEFAULT 0,
    vip_status BOOLEAN DEFAULT FALSE,
    vip_expiry TIMESTAMPTZ,
    ad_free BOOLEAN DEFAULT FALSE,
    infinite_energy BOOLEAN DEFAULT FALSE,
    UNIQUE(player_id)
);

-- Mini-game scores table
CREATE TABLE minigame_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    high_score INTEGER NOT NULL DEFAULT 0,
    last_played TIMESTAMPTZ,
    daily_plays INTEGER DEFAULT 0,
    UNIQUE(player_id, game_id)
);

-- Achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_id, achievement_id)
);

-- Story progress table
CREATE TABLE story_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
    current_arc TEXT DEFAULT 'freshman',
    completed_scenes JSONB NOT NULL DEFAULT '[]',
    major_choices JSONB NOT NULL DEFAULT '[]',
    UNIQUE(player_id)
);

-- Create indexes for performance
CREATE INDEX idx_player_profiles_user_id ON player_profiles(user_id);
CREATE INDEX idx_rooms_player_id ON rooms(player_id);
CREATE INDEX idx_npc_relationships_player_id ON npc_relationships(player_id);
CREATE INDEX idx_purchase_history_player_id ON purchase_history(player_id);
CREATE INDEX idx_achievements_player_id ON achievements(player_id);

-- Row Level Security (RLS) policies
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE npc_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE minigame_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own data
CREATE POLICY "Players own their profile" ON player_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Players own their room" ON rooms
    FOR ALL USING (player_id IN (SELECT id FROM player_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Players own their relationships" ON npc_relationships
    FOR ALL USING (player_id IN (SELECT id FROM player_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Players own their inventory" ON player_inventory
    FOR ALL USING (player_id IN (SELECT id FROM player_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Players own their purchases" ON purchase_history
    FOR ALL USING (player_id IN (SELECT id FROM player_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Players own their meta" ON player_meta
    FOR ALL USING (player_id IN (SELECT id FROM player_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Players own their scores" ON minigame_scores
    FOR ALL USING (player_id IN (SELECT id FROM player_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Players own their achievements" ON achievements
    FOR ALL USING (player_id IN (SELECT id FROM player_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Players own their story" ON story_progress
    FOR ALL USING (player_id IN (SELECT id FROM player_profiles WHERE user_id = auth.uid()));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_player_profiles_updated_at BEFORE UPDATE ON player_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_inventory_updated_at BEFORE UPDATE ON player_inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
