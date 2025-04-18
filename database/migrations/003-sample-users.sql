INSERT INTO
    users (id, email, handle, password_hash, created_at, email_verified_at, last_login)
VALUES
    (
        1,
        'raccoon@test.com',
        'raccoon',
        '$2b$10$cZQp6DWquYpxlO1CGVJqB.4uThBwb0tE9ImJMQYKtvg9UOoRF63.q',
        '2025-01-01 12:00:00',
        '2025-01-01 12:15:00',
        '2025-04-01 13:00:00'
    ),
    (
        2,
        'martin@test.com',
        'martin',
        '$2b$10$cZQp6DWquYpxlO1CGVJqB.4uThBwb0tE9ImJMQYKtvg9UOoRF63.q',
        '2025-01-01 12:00:00',
        '2025-01-01 12:15:00',
        '2025-04-01 13:00:00'
    ),
    (
        3,
        'admin@test.com',
        'admin',
        '$2b$10$cZQp6DWquYpxlO1CGVJqB.4uThBwb0tE9ImJMQYKtvg9UOoRF63.q',
        '2025-01-01 12:00:00',
        '2025-01-01 12:15:00',
        '2025-04-01 13:00:00'
    );

INSERT INTO
    profiles (user_id, display_name, bio)
VALUES
    (1, 'Raccoon', 'Just a raccoon.'),
    (2, 'Martin', 'Just a Martin.'),
    (3, 'Admin', 'Just an admin.');