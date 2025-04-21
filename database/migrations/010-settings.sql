CREATE TABLE IF NOT EXISTS settings (
    user_id INTEGER PRIMARY KEY,
    like_notifications_enabled INTEGER DEFAULT 1,
    follow_notifications_enabled INTEGER DEFAULT 1,
    reply_notifications_enabled INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
)