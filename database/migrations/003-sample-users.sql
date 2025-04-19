INSERT INTO
    users (handle, email, name, bio, password_hash, created_at, email_verified_at, last_login)
VALUES
    (
        'raccoon',
        'raccoon@test.com',
        'Script Raccoon',
        'Just a raccoon.',
        '$2b$10$cZQp6DWquYpxlO1CGVJqB.4uThBwb0tE9ImJMQYKtvg9UOoRF63.q',
        '2025-01-01 12:00:00',
        '2025-01-01 12:15:00',
        '2025-04-01 13:00:00'
    ),
    (
        'martin',
        'martin@test.com',
        'Martin',
        'Just Martin.',
        '$2b$10$cZQp6DWquYpxlO1CGVJqB.4uThBwb0tE9ImJMQYKtvg9UOoRF63.q',
        '2025-01-01 12:00:00',
        '2025-01-01 12:15:00',
        '2025-04-01 13:00:00'
    ),
    (
        'admin',
        'admin@test.com',
        'Administrator',
        'Just an admin.',
        '$2b$10$cZQp6DWquYpxlO1CGVJqB.4uThBwb0tE9ImJMQYKtvg9UOoRF63.q',
        '2025-01-01 12:00:00',
        '2025-01-01 12:15:00',
        '2025-04-01 13:00:00'
    );