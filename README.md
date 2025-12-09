# Niesl Hyves Guestbook

Tacky early-2000s guestbook for niesl.nl built with Next.js 14, Prisma, and PostgreSQL.

## Quick start (Docker)

1. Create an `.env` (see `env.example`).
2. Build and run:
   ```bash
   docker build -t niesl-guestbook .
   docker run -d --name niesl -p 80:80 --env-file .env niesl-guestbook
   ```
   If port 80 is busy the app falls back to 3000 (logged to console).

## Environment

- `DATABASE_URL` PostgreSQL connection string.
- `ADMIN_PASSWORD` Password for `/admin`.
- `ADMIN_COOKIE_SECRET` Any random string to sign the admin cookie.
- `UPLOAD_DIR` (optional) Folder for uploads, default `./uploads`.
- `NEXT_PUBLIC_SITE_NAME` Public site title.

## Local dev

```bash
npm install
npx prisma generate
npm run dev
```

## Notes

- API routes under `/api/guestbook/*`.
- Uploads are served from `/uploads/*`.
- Admin at `/admin`; login at `/admin/login`.

