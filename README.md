# SyncNote

A web app for writing, organizing, and sharing notes with Markdown support.

## Features

- Markdown editor with live preview
- Note organization with folders and subfolders
- Share notes via link (read-only public view)
- User authentication (register & login)
- Dark/light theme
- Responsive design (mobile-friendly)
- Export notes as `.md` files

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js v5
- **Database:** PostgreSQL (Neon) via Prisma ORM

## Getting Started

```bash
npm install
```

Create a `.env` file:

```env
DATABASE_URL="your-postgresql-url"
AUTH_SECRET="your-secret"
```

```bash
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
