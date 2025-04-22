CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL CHECK (LENGTH (content) <= 280),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_id INTEGER,
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES posts (id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_created_at ON posts (created_at);

CREATE INDEX idx_posts_author_id ON posts (author_id);

CREATE INDEX idx_posts_parent_id ON posts (parent_id);
