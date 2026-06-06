# Supabase as Phase 1 backend

FOP Phase 1 uses Supabase for PostgreSQL, Auth, and Row Level Security instead of a self-hosted API + database. This accelerates MVP delivery with built-in JWT auth and RLS aligned to our six fixed roles. Migrating off Supabase later would require extracting schema, auth, and policies — acceptable trade-off for Phase 1 speed.

**Considered Options:** Self-hosted Postgres + custom Node API; Firebase.

**Status:** accepted
