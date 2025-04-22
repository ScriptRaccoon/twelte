CREATE TABLE IF NOT EXISTS follow_notifications (
    id INTEGER PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    read INTEGER DEFAULT 0,
    FOREIGN KEY (id) REFERENCES follows (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS like_notifications (
    id INTEGER PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    read INTEGER DEFAULT 0,
    FOREIGN KEY (id) REFERENCES likes (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reply_notifications (
    id INTEGER PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    read INTEGER DEFAULT 0,
    FOREIGN KEY (id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_follow_notifications_user_id ON follow_notifications (user_id);

CREATE INDEX idx_like_notifications_user_id ON like_notifications (user_id);

CREATE INDEX idx_reply_notifications_user_id ON reply_notifications (user_id);