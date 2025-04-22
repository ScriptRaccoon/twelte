CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    handle TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    bio TEXT NOT NULL DEFAULT "",
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    email_verified_at TIMESTAMP,
    avatar_url TEXT,
    website TEXT
);

CREATE INDEX idx_users_handle ON users (handle);

CREATE TABLE IF NOT EXISTS tokens (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    purpose TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (datetime ('now', '+1 hour')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
