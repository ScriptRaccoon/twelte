INSERT INTO
    hashtags (tag)
VALUES
    ("Germany"),
    ("Italy"),
    ("China");

INSERT INTO
    posts (id, author_id, content)
VALUES
    (300, 1, "In #Germany we have a lot of bread"),
    (301, 2, "In #Italy we have a lot of pizza"),
    (302, 3, "In #China we have a lot of rice"),
    (303, 1, "We will make #Germany a trending topic"),
    (304, 2, "Do not forget about #Italy and #China");

INSERT INTO
    post_hashtags (post_id, hashtag)
VALUES
    (300, "Germany"),
    (301, "Italy"),
    (302, "China"),
    (303, "Germany"),
    (304, "Italy"),
    (304, "China");
