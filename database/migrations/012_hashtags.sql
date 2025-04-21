CREATE TABLE IF NOT EXISTS hashtags (tag TEXT PRIMARY KEY);

CREATE TABLE IF NOT EXISTS post_hashtags (
    post_id INTEGER NOT NULL,
    hashtag TEXT NOT NULL,
    PRIMARY KEY (post_id, hashtag),
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag) REFERENCES hashtags (tag) ON DELETE CASCADE
);

CREATE INDEX idx_post_hashtags_post_id ON post_hashtags (post_id);

CREATE INDEX idx_post_hashtags_hashtag_id ON post_hashtags (hashtag);