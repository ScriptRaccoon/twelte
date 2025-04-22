INSERT INTO
    users (
        id,
        handle,
        email,
        name,
        bio,
        password_hash,
        created_at,
        email_verified_at,
        last_login,
        avatar_url
    )
VALUES
    (
        1,
        'raccoon',
        'raccoon@test.com',
        'Script Raccoon',
        'Just a raccoon.',
        '$2b$10$cZQp6DWquYpxlO1CGVJqB.4uThBwb0tE9ImJMQYKtvg9UOoRF63.q',
        '2025-01-01 12:00:00',
        '2025-01-01 12:15:00',
        '2025-04-01 13:00:00',
        "https://res.cloudinary.com/dn9qxvfdr/image/upload/twelte/uploads/avatars/user_1.webp"
    ),
    (
        2,
        'martin',
        'martin@test.com',
        'Martin',
        'Just Martin.',
        '$2b$10$cZQp6DWquYpxlO1CGVJqB.4uThBwb0tE9ImJMQYKtvg9UOoRF63.q',
        '2025-01-01 12:00:00',
        '2025-01-01 12:15:00',
        '2025-04-01 13:00:00',
        NULL
    ),
    (
        3,
        'admin',
        'admin@test.com',
        'Administrator',
        'Just an admin.',
        '$2b$10$cZQp6DWquYpxlO1CGVJqB.4uThBwb0tE9ImJMQYKtvg9UOoRF63.q',
        '2025-01-01 12:00:00',
        '2025-01-01 12:15:00',
        '2025-04-01 13:00:00',
        "https://res.cloudinary.com/dn9qxvfdr/image/upload/twelte/uploads/avatars/user_3.webp"
    );