# Twelte

**Twitter Clone made with SvelteKit and SQLite**

<https://twelte.netlify.app>

## Features

This is a rough summary of the features of _Twelte_.

- Intuitive and Responsive UI
- User authentication
- Email verification
- Password reset
- Account Page
- Profile Page
- Avatar upload
- Create Posts
- Like Posts
- Reply to Posts
- Automatic Hashtags generation
- Follow other users
- Feed with all posts
- Feed with followed posts
- Infinite Loading
- Page with popular hashtags
- Notifications
- Notification settings

Everything is self-made as far as possible. This includes in particular a self-made authentication process, and the usage of raw SQL.

## Datebase structure

See [`DATABASE.md`](./DATABASE.md).

## App commands

- `pnpm dev`: Start the development server
- `pnpm build`: Build the application

## Database commands

- `pnpm db:migrate`: Runs the migrations (local + remote).
- `pnpm db:shell`: Opens the SQL shell (local).
- `pnpm db:remote`: Opens the SQL shell (remote).
- `pnpm db:kill`: Deletes the local database file.
- `pnpm db:erd`: Creates the diagram in `DATABASE.md` from the local database.

## Dependencies

- **[SvelteKit](https://svelte.dev)** (framework)
- **[libsql](https://github.com/tursodatabase/libsql)** (queries to SQLite database)
- **[Turso](https://turso.tech)** (deployment of SQLite database)
- **[Netlify](https://www.netlify.com)** (deployment of the application)
- **[Netlify Functions](https://docs.netlify.com/functions/overview)** (scheduled database cleanup)
- **[bcrypt](https://www.npmjs.com/package/bcryptjs)** (hashing of passwords)
- **[cloudinary](https://cloudinary.com)** (image upload)
- **[nodemailer](https://nodemailer.com)** (emails)
- **[Zod](https://zod.dev)** (data verification and parsing)
