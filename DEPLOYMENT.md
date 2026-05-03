# Deployment (Vercel) + Auth URLs

## Environment variables (Vercel)
In Vercel → Project → Settings → Environment Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These are the same values you use in local `.env.local`.

## Supabase Auth URL configuration
In Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**
  - local: `http://localhost:3000`
  - production: `https://<your-vercel-domain>`

- **Redirect URLs** (add both local and production)
  - `http://localhost:3000/auth/callback`
  - `https://<your-vercel-domain>/auth/callback`

This app uses `/auth/callback` to complete Google OAuth and email magic link sessions.

## Google OAuth notes
When configuring Google OAuth in Supabase, Google will require “Authorized redirect URIs”.
Those are managed by Supabase (not by this app directly). Follow the Supabase UI guidance for the correct Google redirect URL for your project.

## Admin access checklist
Admin access requires **both**:
1) successful sign-in (Google or magic link)
2) the signed-in email existing in `public.admin_users` with `is_active = true`

If an authenticated user is not in `admin_users`, they will be redirected away from `/admin`.

