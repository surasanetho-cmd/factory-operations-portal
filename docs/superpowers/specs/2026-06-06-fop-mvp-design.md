# FOP MVP Design Specification

**Date:** 2026-06-06  
**Status:** Approved for implementation  
**Context:** [CONTEXT.md](../../CONTEXT.md)

## Purpose

Factory Operations Portal Phase 1 — visibility and workflow for Sale, Planning, Store, Production, and Manager roles. No SAP integration; mock data and CSV import.

## Architecture

- **Frontend:** Next.js 15 App Router, TypeScript, design-system tokens, Shadcn primitives
- **Backend:** Supabase (Auth + PostgreSQL + RLS)
- **State:** Zustand for UI state; server data via Supabase client
- **Domain:** 1 Order → many Production Plans → many Material Requests

## RBAC Matrix

| Module | ADMIN | SALE | PLANNING | STORE | PRODUCTION | MANAGER |
|--------|-------|------|----------|-------|------------|---------|
| Dashboard (all) | ✓ | Sales | Planning | Store | Production | Executive |
| Orders | CRUD | Read | Read | — | — | Read |
| Production Plans | CRUD | Read | CRUD | Read | Read | Read |
| Material Requests | CRUD | — | Read | Process | Create/Submit | Read |
| Inventory | CRUD | Read | Read | Update | Read | Read |
| Notifications | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Activity Logs | ✓ | — | — | — | — | Read |
| Users/Roles | ✓ | — | — | — | — | — |
| CSV Import | ✓ | — | — | — | — | — |

### Material Request Workflow

| Transition | Allowed Role |
|------------|--------------|
| DRAFT → SUBMITTED | PRODUCTION |
| SUBMITTED → APPROVED | STORE |
| APPROVED → ISSUED | STORE |
| ISSUED → COMPLETED | STORE |

## Routes

```
/login
/dashboard/executive    (MANAGER, ADMIN)
/dashboard/sales        (SALE)
/dashboard/planning     (PLANNING)
/dashboard/store        (STORE)
/dashboard/production   (PRODUCTION)
/operations/orders
/operations/orders/[id]
/operations/plans
/operations/plans/[id]
/operations/material-requests
/operations/material-requests/[id]
/operations/inventory
/admin/users
/admin/settings
/admin/import
```

Default landing after login: role-specific dashboard.

## Dashboard KPIs

### Executive
- Total Orders, Open Orders, Late Orders
- Production progress (% plans IN_PROGRESS or COMPLETED vs total)
- Inventory alerts (LOW + CRITICAL count)
- Pending Material Requests (SUBMITTED + APPROVED)

### Sales
- Customer Orders count, Due this week, Production progress per order

### Planning
- Open Plans (DRAFT + RELEASED), Material Readiness risk count, Late Orders

### Store
- Pending MR, Low stock count, Critical stock count

### Production
- Today's plans, Actual progress (IN_PROGRESS plans), Open MR

## UI

- Dark-first per [UX-UI-Design-System.md](../../UX-UI-Design-System.md)
- Sidebar + top header + notification bell + profile menu
- Thai language throughout
- Sarabun font via `project.config.css`

## CSV Import (Admin)

**Orders:** order_no, customer_name, part_no, part_name, quantity, due_date  
**Inventory:** material_code, material_name, current_stock, safety_stock, unit

Validation errors displayed in Thai.

## Out of Scope

SAP sync, multi-warehouse, dynamic roles, reports section, light theme default.
