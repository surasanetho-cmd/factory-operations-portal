# Factory Operations Portal

Visibility and workflow platform for automotive parts manufacturing. FOP tracks orders, production plans, material requests, and inventory alongside SAP — SAP remains the system of record; FOP is the cross-department collaboration layer for Phase 1.

## Language

### Orders & Planning

**Order**:
A customer production request tracked in FOP with a unique `order_no`. Phase 1 uses internally managed orders (CSV/mock); `order_no` may mirror a future SAP sales order number but FOP owns the lifecycle until SAP integration.
_Avoid_: Sales order (SAP term), job, work order

**Production Plan**:
A scheduled batch of work for part of an Order's quantity on a specific plan date. One Order may have many Production Plans.
_Avoid_: Schedule, job, work order

**Late Order**:
An Order whose `due_date` is before today and whose status is not COMPLETED or SHIPPED.
_Avoid_: Overdue (use consistently as Late Order), delayed

**Order Status**:
The aggregate lifecycle of an Order (NEW → PLANNING → MATERIAL_CHECK → READY → IN_PRODUCTION → COMPLETED → SHIPPED). When all Production Plans for an Order reach COMPLETED, the Order moves to COMPLETED.
_Avoid_: State, phase

### Materials & Inventory

**Material Request**:
A formal request to issue raw materials from the store for a Production Plan. Created by Production, submitted for approval, fulfilled by Store.
_Avoid_: Requisition, pick list, PR (purchase requisition)

**Material Request Item**:
A single material line on a Material Request with requested and issued quantities.
_Avoid_: Line, row

**Inventory Item**:
A stock record for one material at the single plant warehouse (Phase 1). Identified by `material_code`.
_Avoid_: Stock, SKU, part (when referring to finished goods)

**Material Readiness**:
Whether sufficient inventory exists to fulfill all Material Request Items for a Production Plan before release.
_Avoid_: Availability check, stock OK

### People & Access

**Profile**:
An employee's FOP identity linked to Supabase Auth, with role, department, and employee code.
_Avoid_: User (when meaning auth account), account

**Role**:
One of six fixed access levels: ADMIN, SALE, PLANNING, STORE, PRODUCTION, MANAGER. Determines module visibility and actions.
_Avoid_: Permission group, access level

### Notifications & Audit

**Notification**:
An in-app alert delivered to a Profile about a domain event (e.g. Material Request submitted, low stock).
_Avoid_: Alert, message (generic)

**Activity Log**:
An immutable audit record of a significant action (who, what module, description).
_Avoid_: Audit trail (acceptable synonym but prefer Activity Log in UI)
