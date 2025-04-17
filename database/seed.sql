PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    handle TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_handle ON users (handle);

CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    display_name TEXT NOT NULL,
    bio TEXT NOT NULL DEFAULT "",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_profiles_user_id ON profiles (user_id);

CREATE TRIGGER IF NOT EXISTS update_profile_timestamp AFTER
UPDATE ON profiles FOR EACH ROW BEGIN
UPDATE profiles
SET
    updated_at = CURRENT_TIMESTAMP
WHERE
    id = OLD.id;

END;

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL CHECK (LENGTH (content) <= 280),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    parent_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES posts (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS follows (
    id INTEGER PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    followed_id INTEGER NOT NULL CHECK (follower_id != followed_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (follower_id, followed_id),
    FOREIGN KEY (follower_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_hashtags (
    id INTEGER PRIMARY KEY,
    post_id INTEGER NOT NULL,
    hashtag TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);