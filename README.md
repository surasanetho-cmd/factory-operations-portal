# Factory Operations Portal (FOP)

Web application for automotive parts factory operations — visibility, workflow tracking, and cross-department collaboration alongside SAP.

## Phase 1 MVP

- Authentication & RBAC (6 roles)
- Dashboards per role
- Orders, Production Plans, Material Requests, Inventory
- Notifications & Activity Logs
- CSV Import (Admin)
- Mock/seed data (no SAP)

## Tech Stack

- Next.js 15, TypeScript, Tailwind, Shadcn primitives
- Supabase (Auth + PostgreSQL + RLS)
- Zustand, TanStack Table, RHF + Zod, Recharts, Sonner

## Deploy (GitHub + Vercel + Supabase Cloud)

ไม่ต้องรัน local — ใช้ Supabase บน cloud + deploy แอปบน Vercel (แนะนำสำหรับ Next.js)

### A. Supabase (ทำครั้งเดียว)

1. [Supabase Dashboard](https://supabase.com/dashboard) → project ของคุณ
2. **SQL Editor** → Run `supabase/migrations/001_initial_schema.sql`
3. **SQL Editor** → Run `supabase/seed.sql`
4. **Authentication → Users** → สร้าง user + metadata `{ "role": "ADMIN", "name": "...", "employee_code": "..." }`
5. **Authentication → URL Configuration** (หลัง deploy Vercel แล้ว):
   - **Site URL:** `https://your-app.vercel.app`
   - **Redirect URLs:** `https://your-app.vercel.app/**`

### B. GitHub

```bash
git init
git add .
git commit -m "Initial FOP MVP"
```

สร้าง repo ใหม่ที่ [github.com/new](https://github.com/new) แล้ว:

```bash
git remote add origin https://github.com/YOUR_USER/factory-operations-portal.git
git branch -M main
git push -u origin main
```

### C. Vercel (เชื่อม GitHub + Supabase)

1. [vercel.com](https://vercel.com) → **Add New Project** → Import repo จาก GitHub
2. **Environment Variables** (Production):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key จาก Supabase → Settings → API |

3. **Deploy** → ได้ URL เช่น `https://factory-operations-portal.vercel.app`
4. กลับไป Supabase → **Authentication → URL Configuration** → ใส่ URL จริงจาก Vercel

**สำคัญ:** อย่า commit `.env.local` — ใส่ secrets เฉพาะใน Vercel Environment Variables

---

## Local Development (optional)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env.local
   ```
   Set Supabase URL and anon key.

3. Apply database migration:
   ```bash
   # Using Supabase CLI or run SQL in Dashboard
   supabase db push
   ```
   Or execute `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor.

4. Seed sample data:
   ```bash
   # Run supabase/seed.sql in SQL Editor
   ```

5. Create users in Supabase Auth with metadata:
   ```json
   { "role": "ADMIN", "name": "Admin User", "employee_code": "EMP001" }
   ```

6. Start dev server:
   ```bash
   npm run dev
   ```

## Documentation

- [CONTEXT.md](./CONTEXT.md) — Domain glossary
- [docs/adr/](./docs/adr/) — Architecture decisions
- [docs/superpowers/specs/2026-06-06-fop-mvp-design.md](./docs/superpowers/specs/2026-06-06-fop-mvp-design.md) — Design spec

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm test` — Run Vitest tests
