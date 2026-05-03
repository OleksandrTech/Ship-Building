# Supabase setup (local + Vercel)

This project uses:
- Supabase Auth (Google OAuth + email magic links)
- Supabase Database (Postgres)
- Next.js App Router

## 1) Create a Supabase project
Create a new project in Supabase, then copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **Anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Add them to `.env.local` (copy from `.env.local.example`).

## 2) Enable Authentication providers

### Email magic links
In Supabase Dashboard:
- **Authentication** → **Providers** → **Email**
  - enable email provider
  - keep “magic link” enabled

### Google OAuth
In Supabase Dashboard:
- **Authentication** → **Providers** → **Google**
  - enable Google provider
  - add the required Google OAuth client id/secret

## 3) Configure Auth redirect URLs
In Supabase Dashboard:
- **Authentication** → **URL Configuration**
  - **Site URL**: `http://localhost:3000`
  - **Redirect URLs**: add:
    - `http://localhost:3000/auth/callback`
    - `https://<your-vercel-domain>/auth/callback`

## 4) Create database tables + RLS policies
Run the SQL in `supabase/schema.sql` in:
- **SQL Editor** → **New query**

## 5) Seed your first admin user
After the schema is created, insert your email into `admin_users` (exact SQL is included at the bottom of `supabase/schema.sql`).

## 6) Run locally
```bash
npm run dev
```

