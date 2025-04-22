// We don't use a SQL View for that since it cannot include the user_id parameter 🫤
const GENERAL_POST_QUERY = `
SELECT
    posts.id,
    posts.content,
    posts.created_at,
    posts.parent_id,
    users.id as author_id,
    users.handle as author_handle,
    users.name as author_name,
    users.avatar_url as author_avatar_url,
    (
        SELECT COUNT(*)
        FROM likes
        WHERE likes.post_id = posts.id
    ) as likes_count,
    EXISTS (
        SELECT 1
        FROM likes
        WHERE likes.post_id = posts.id AND likes.user_id = :user_id
    ) as liked_by_user,
    (
        SELECT COUNT(*)
        FROM posts replies
        WHERE replies.parent_id = posts.id
    ) as replies_count
FROM
    posts
INNER JOIN
    users ON posts.author_id = users.id
`

export const ALL_POSTS_QUERY = `
${GENERAL_POST_QUERY}
WHERE
    posts.parent_id IS NULL
ORDER BY
    posts.created_at DESC
LIMIT :limit
OFFSET :offset
`

export const FOLLOWED_POSTS_QUERY = `
${GENERAL_POST_QUERY}
INNER JOIN
    follows ON follows.followed_id = posts.author_id
WHERE
    follows.follower_id = :user_id
    AND posts.parent_id IS NULL
ORDER BY
    posts.created_at DESC
LIMIT :limit
OFFSET :offset
`

export const SINGLE_POST_QUERY = `
${GENERAL_POST_QUERY}
WHERE
    posts.id = :post_id
`

export const REPLIES_QUERY = `
${GENERAL_POST_QUERY}
WHERE
    posts.parent_id = :parent_id
ORDER BY
    posts.created_at DESC
`

export const POSTS_BY_AUTHOR_QUERY = `
${GENERAL_POST_QUERY}
WHERE
    posts.author_id = :author_id
    AND posts.parent_id IS NULL
ORDER BY
    posts.created_at DESC
LIMIT :limit
OFFSET :offset
`

export const POSTS_BY_HASHTAG_QUERY = `
${GENERAL_POST_QUERY}
INNER JOIN
    post_hashtags ON post_hashtags.post_id = posts.id
WHERE
    post_hashtags.hashtag = :tag
    AND posts.parent_id IS NULL
ORDER BY
    posts.created_at DESC
LIMIT :limit
OFFSET :offset
`

export const POSTS_BY_SEARCH_QUERY = `
${GENERAL_POST_QUERY}
WHERE
    posts.content LIKE :search
ORDER BY
    posts.created_at DESC
LIMIT :limit
OFFSET :offset
`
