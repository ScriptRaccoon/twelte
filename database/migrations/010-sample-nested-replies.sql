INSERT INTO
    posts (author_id, content, parent_id)
VALUES
    -- Nested replies to reply 81
    (3, "This is a nested reply to reply 81", 81),
    (2, "This is another nested reply to reply 81", 81),
    (1, "This is a third nested reply to reply 81", 81),
    -- Nested replies to reply 80
    (3, "This is a nested reply to reply 80", 80),
    (2, "This is another nested reply to reply 80", 80),
    (1, "This is a third nested reply to reply 80", 80),
    -- Nested replies to reply 85
    (3, "This is a nested reply to reply 85", 85),
    (2, "This is another nested reply to reply 85", 85),
    (1, "This is a third nested reply to reply 85", 85),
    (1, "This is a fourth nested reply to reply 85", 85),
    (2, "This is a fifth nested reply to reply 85", 85),
    (3, "This is a sixth nested reply to reply 85", 85);