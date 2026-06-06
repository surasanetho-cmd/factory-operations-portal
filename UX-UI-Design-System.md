# UX/UI Design System — Standard v1.0

> **Project-agnostic design system สำหรับ Industrial Web Applications**  
> ออกแบบสำหรับ Factory / Enterprise environments: PC, Tablet, Mobile  
> Override ค่าต่าง ๆ ผ่าน `project.config.css` ต่อ project

---

## 0. How to Use

```
design-system/
├── tokens/
│   ├── colors.css          ← CSS custom properties (dark + light)
│   ├── typography.css
│   ├── spacing.css
│   └── motion.css
├── components/
│   ├── buttons.css
│   ├── forms.css
│   ├── tables.css
│   ├── modals.css
│   └── badges.css
├── layout/
│   ├── sidebar.css
│   └── page.css
└── project.config.css      ← Per-project overrides (accent color, fonts, logo)
```

**ขั้นตอนนำไปใช้ใน Project ใหม่:**

1. Import `design-system/` ทั้งโฟลเดอร์
2. สร้าง `project.config.css` override เฉพาะ token ที่ต่างออกไป
3. ตั้งค่า `--accent`, `--font-body`, `--font-display` ให้ตรง Brand
4. ใช้ component class ตาม Pattern Library (Section 17)

---

## 1. Design Philosophy

| Principle | คำอธิบาย |
|-----------|----------|
| **Dark-first** | Default เป็น Dark mode เพื่อลดแสงสะท้อนในสภาพแวดล้อมโรงงาน |
| **Functional clarity** | ข้อมูลมาก่อน ตกแต่งทีหลัง — ทุกองค์ประกอบต้องมีเหตุผล |
| **Thai-friendly** | Font stack รองรับภาษาไทยเป็นหลัก |
| **Progressive disclosure** | ซ่อน detail ที่ไม่จำเป็น แสดงเมื่อ user ต้องการ |
| **Accessible** | ผ่าน WCAG AA contrast ratio ทั้ง dark และ light mode |

---

## 2. Color Tokens

### 2.1 Dark Mode (Default)

```css
:root {
  /* ─── Surface ─────────────────────────────── */
  --color-bg:         #080f08;   /* พื้นหลักสุด */
  --color-bg-subtle:  #0d1a0e;   /* พื้นรอง */
  --color-bg-raised:  #132415;   /* Input, Modal background */
  --color-surface:    #0f1f10;   /* Card */

  /* ─── Border ──────────────────────────────── */
  --color-border:     #1e3421;
  --color-border-strong: #2a4530;

  /* ─── Accent (per-project override) ──────── */
  --color-accent:         #3dd65c;              /* Primary CTA, active state */
  --color-accent-subtle:  rgba(61, 214, 92, 0.09);
  --color-accent-alt:     #f59a3f;              /* Secondary action, warning */

  /* ─── Semantic ─────────────────────────────  */
  --color-success:  #3dd65c;
  --color-warning:  #f59a3f;
  --color-danger:   #e05c4a;
  --color-info:     #4d9fff;
  --color-neutral:  #9b8de8;

  /* ─── Text ────────────────────────────────── */
  --color-text:         #dff0e1;   /* Body text */
  --color-text-subtle:  #8aba8e;   /* Secondary text */
  --color-text-muted:   #527855;   /* Label, hint */
  --color-text-faint:   #334e36;   /* Divider text */
}
```

### 2.2 Light Mode

```css
[data-theme="light"] {
  --color-bg:             #f5f7f5;
  --color-bg-subtle:      #ffffff;
  --color-bg-raised:      #eef3ee;
  --color-surface:        #ffffff;
  --color-accent:         #0d3d14;
  --color-text:           #0a1f0c;
  --color-text-subtle:    #2d4a30;
  --color-text-muted:     #6a8a6d;
}
```

### 2.3 Semantic Category Colors

ใช้สำหรับ Skill หรือ Category tag ทั่วไป — override ได้ต่อ project:

```css
:root {
  --color-cat-1: #ef4444;   /* Category A (เช่น Hard Skill) */
  --color-cat-2: #f97316;   /* Category B (เช่น Machine Skill) */
  --color-cat-3: #3b82f6;   /* Category C (เช่น Product Skill) */
  --color-cat-4: #a855f7;   /* Category D (เช่น Soft Skill) */
}
```

### 2.4 Department / Group Colors

```css
:root {
  --color-group-1: #4dcc6a;
  --color-group-2: #f59a3f;
  /* เพิ่ม --color-group-N ตามจำนวน dept ของแต่ละ project */
}
```

---

## 3. Typography

### 3.1 Font Stack

```css
:root {
  --font-body:    'Sarabun', 'Tahoma', sans-serif;   /* ข้อความทั่วไป */
  --font-display: 'Tahoma', 'Sarabun', sans-serif;   /* KPI, หัว, ตาราง */
  --font-mono:    'JetBrains Mono', 'Consolas', monospace;
}
```

> **Project override**: เปลี่ยน `--font-body` / `--font-display` ใน `project.config.css`

### 3.2 Type Scale

```css
:root {
  --text-xs:   10px;   /* Badge, tag, micro label */
  --text-sm:   12px;   /* Table header, section header */
  --text-base: 15px;   /* Table cell, body */
  --text-md:   16px;   /* Input, nav link */
  --text-lg:   18px;   /* Sub-heading */
  --text-xl:   22px;   /* Page title */
  --text-2xl:  28px;   /* KPI value */
  --text-3xl:  36px;   /* Hero KPI */
}
```

### 3.3 Responsive Font Scaling

```css
/* Small phone ≤ 480px */
@media (max-width: 480px) {
  :root { font-size: 13px; }
}

/* Mobile 481–768px */
@media (min-width: 481px) and (max-width: 768px) {
  :root { font-size: 14px; }
}

/* Tablet 769–1024px */
@media (min-width: 769px) and (max-width: 1024px) {
  :root { font-size: 15px; }
}

/* Desktop 1025–1599px */
@media (min-width: 1025px) and (max-width: 1599px) {
  :root { font-size: 16px; }
}

/* Wide 1600–1919px */
@media (min-width: 1600px) and (max-width: 1919px) {
  :root { font-size: 17px; }
}

/* Ultra-wide / TV ≥ 1920px */
@media (min-width: 1920px) {
  :root { font-size: 18px; }
}
```

### 3.4 Typography Roles

| Role | Rules |
|------|-------|
| **KPI value** | `font-family: var(--font-display); font-weight: 700; font-size: var(--text-2xl)` |
| **Table header** | `font-size: var(--text-sm); letter-spacing: 0.10em; text-transform: uppercase; color: var(--color-text-muted)` |
| **Section header** | `font-size: var(--text-xs); letter-spacing: 2.5px; text-transform: uppercase` |
| **Badge / tag** | `font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.8px` |

---

## 4. Spacing

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-7:  28px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
}
```

---

## 5. Border Radius

```css
:root {
  --radius-sm: 3px;   /* Badge, tag */
  --radius:    4px;   /* Input, button */
  --radius-lg: 8px;   /* Card, modal */
  --radius-xl: 12px;  /* Large panel (optional) */
}
```

---

## 6. Shadows

```css
:root {
  --shadow-sm: 0 2px 8px  rgba(0, 0, 0, 0.50);   /* Card */
  --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.70);   /* Dropdown, floating UI */
  --shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.85);  /* Modal */
}

[data-theme="light"] {
  --shadow-sm: 0 2px 8px  rgba(0, 0, 0, 0.07);
  --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.10);
  --shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.14);
}
```

---

## 7. Z-Index Scale

```css
:root {
  --z-base:       0;
  --z-sticky:     10;
  --z-dropdown:   100;
  --z-sidebar-bg: 990;
  --z-sidebar:    1000;
  --z-modal:      2000;
  --z-toast:      3000;
  --z-splash:     9000;
}
```

---

## 8. Motion & Animation

```css
:root {
  --duration-fast:   120ms;   /* Micro: hover, focus */
  --duration-normal: 220ms;   /* UI response: open/close */
  --duration-slow:   400ms;   /* Page transition */
  --duration-enter:  900ms;   /* Splash, onboarding */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);   /* Material standard */
}
```

**กฎ:**
- CSS transitions → micro-interactions (hover, focus, active)
- Framer Motion → page transitions, complex sequences
- ปิด animation ทั้งหมดเมื่อ `prefers-reduced-motion: reduce`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Layout

### 9.1 Sidebar

```css
:root {
  --sidebar-width-mobile:  280px;   /* Overlay on mobile */
  --sidebar-width-tablet:  210px;
  --sidebar-width-desktop: 252px;
  --sidebar-width-ultra:   280px;
}
```

- Fixed sidebar + scrollable `<main>`
- `<main>` ใช้ `min-height: 100vh` (**ไม่ใช้** `height: 100vh`) — ป้องกัน nested scroll container
- Mobile: slide-in overlay + backdrop `rgba(0, 0, 0, 0.65)`

### 9.2 Page Content

```css
.page-content {
  padding: var(--space-6) var(--space-7);   /* 24px 28px */
  max-width: 1800px;
  margin: 0 auto;
}

@media (max-width: 480px)  { .page-content { padding: var(--space-3); } }
@media (max-width: 768px)  { .page-content { padding: var(--space-4); } }
@media (min-width: 1280px) { .page-content { padding: var(--space-7) var(--space-9); } }
@media (min-width: 1920px) { .page-content { padding: var(--space-9) var(--space-12); } }
```

### 9.3 Card

```css
.card {
  background:    var(--color-surface);
  border:        1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow:    var(--shadow-sm);
  padding:       var(--space-5);
}
```

---

## 10. Components

### 10.1 Buttons

```css
/* Base */
.btn {
  font-family:  var(--font-body);
  border-radius: var(--radius);
  cursor: pointer;
  transition: opacity var(--duration-fast) var(--ease-standard),
              transform var(--duration-fast) var(--ease-standard);
}
.btn:hover    { opacity: 0.88; }
.btn:active   { transform: scale(0.97); }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* Primary CTA */
.btn-primary {
  background:  var(--color-accent);
  color:       #000;
  font-weight: 700;
}

/* Danger */
.btn-danger  { background: var(--color-danger); }

/* Ghost / Icon-only */
.btn-icon {
  width: 32px; height: 32px;
  border-radius: 50%;
  /* hover: scale + glow */
}
```

### 10.2 Form Inputs

```css
.input, .select {
  background:    var(--color-bg-raised);
  border:        1px solid var(--color-border-strong);
  border-radius: var(--radius);
  padding:       9px 12px;
  font-family:   var(--font-body);
  font-size:     var(--text-base);
  color:         var(--color-text);
  transition:    border-color var(--duration-fast);
}
.input:focus, .select:focus {
  border-color: var(--color-accent);
  outline: none;
}
.input::placeholder { color: var(--color-text-muted); }
```

### 10.3 Badges

```css
.badge           { font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.8px; border-radius: var(--radius-sm); }
.badge-success   { color: var(--color-success); }
.badge-danger    { color: var(--color-danger); }
.badge-warning   { color: var(--color-warning); }
.badge-info      { color: var(--color-info); }
```

---

## 11. Modal / Overlay

```css
.overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal);
}

.modal {
  background:    var(--color-bg-raised);
  border:        1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  box-shadow:    var(--shadow-lg);
  padding:       var(--space-7);
  width:         min(480px, 94vw);
}
```

---

## 12. Toast Notifications

Singleton pattern:

```js
import { toast } from '@/components/Toast'

toast.success('บันทึกสำเร็จ')
toast.error('เกิดข้อผิดพลาด')
toast.info('กำลังโหลด...')
```

`z-index: var(--z-toast)` — ลอยเหนือทุกอย่างยกเว้น Splash

---

## 13. Tables

### 13.1 Base Style

```css
table { width: 100%; border-collapse: collapse; }

th {
  font-size:       var(--text-sm);
  font-weight:     700;
  letter-spacing:  0.10em;
  text-transform:  uppercase;
  color:           var(--color-text-muted);
  padding:         11px var(--space-4);
  border-bottom:   1px solid var(--color-border);
}

td {
  padding:         11px var(--space-4);
  font-size:       var(--text-base);
  border-bottom:   1px solid var(--color-border);
}

tr:last-child td  { border-bottom: none; }
tr:hover td       { background: var(--color-accent-subtle); }
```

### 13.2 Horizontal Scroll (Wide Tables — Skill Matrix, etc.)

**ปัญหา:** `overflow-x: auto` บังคับให้ `overflow-y: auto` ด้วย → scrollbar จมลงล่าง

**วิธีแก้: Dual Scrollbar Pattern**

```
┌──────────────────────────────────────────┐
│  [=== TOP MIRROR SCROLLBAR ===]          │  ← mirror div, height = scrollbar height
├──────────────────────────────────────────┤
│  Name │ Col1 │ Col2 │ Col3 │ ...         │  ← actual table
│  ...  │      │      │      │             │
└──────────────────────────────────────────┘
```

```js
// Mirror div width = table scrollWidth (synced via ResizeObserver)
// Bidirectional scroll sync via event listeners
// Custom scrollbar: height 8px, background var(--color-border-strong)
```

### 13.3 Scroll Affordance

| Method | คำอธิบาย |
|--------|----------|
| **Fade gradient** | overlay บาง ๆ ด้านซ้าย/ขวา |
| **Bounce arrow** | `›` animate `keyframes bounce-right` ที่ขอบขวา |
| **Hint chip** | "เลื่อนดูข้อมูลทั้งหมด →" แสดงครั้งแรก หายไปหลัง scroll ครั้งแรก |

---

## 14. Responsive Breakpoints

```css
:root {
  --bp-xs:  480px;    /* Small phone */
  --bp-sm:  768px;    /* Mobile */
  --bp-md:  1024px;   /* Tablet */
  --bp-lg:  1280px;   /* Desktop */
  --bp-xl:  1600px;   /* Wide */
  --bp-2xl: 1920px;   /* Ultra-wide / TV */
}
```

| Token | Range | Notes |
|-------|-------|-------|
| `--bp-xs` | ≤ 480px | Single column, compact font |
| `--bp-sm` | ≤ 768px | Sidebar overlay, table scroll wrap |
| `--bp-md` | 769–1024px | Sidebar 210px, compact padding |
| `--bp-lg` | 1025–1279px | Default layout |
| `--bp-xl` | 1280–1599px | Normal spacing |
| `--bp-2xl` | 1600–1919px | Larger nav |
| `--bp-tv` | ≥ 1920px | Sidebar 280px |

```css
/* Common mobile overrides */
@media (max-width: 768px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
  .table-scroll-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .sidebar-backdrop.visible { display: block; }
}
```

---

## 15. Theme Toggle

```js
// Set theme
document.documentElement.setAttribute('data-theme', 'light' | 'dark');

// Persist
localStorage.setItem('theme', value);

// On load
const saved = localStorage.getItem('theme') ?? 'dark';
document.documentElement.setAttribute('data-theme', saved);
```

```css
/* Transition */
*, *::before, *::after {
  transition: background-color 0.22s ease, color 0.15s ease;
}
```

---

## 16. Splash Screen

```
#splash  →  position: fixed; z-index: var(--z-splash)
  ↓  0ms     logo animates up + fade in
  ↓  200ms   title animates up
  ↓  450ms   subtitle fades in
  ↓  bar fills 0 → 100% over ~1.5s
  ↓  add class "hidden"  →  opacity: 0; pointer-events: none
```

---

## 17. Sidebar Navigation

```
Logo (top)
──────────
[nav-link]  icon + label
  active:  background var(--color-accent-subtle); color var(--color-accent); border-left: 2px solid var(--color-accent)
  hover:   background var(--color-accent-subtle); color var(--color-accent)
──────────
[User panel] (bottom)
  avatar | name  (var(--text-sm), bold)
          email  (var(--text-xs), var(--color-text-muted))
          role badge
[Theme toggle] [Logout]
```

---

## 18. Accessibility

| Item | Standard |
|------|----------|
| Contrast ratio | WCAG AA — dark mode text/bg ผ่าน |
| Focus | `border-color: var(--color-accent)` บน inputs |
| Disabled | `opacity: 0.45; cursor: not-allowed` |
| Touch targets | Minimum 44 × 44px บน mobile |
| Focus trap | Modal ควร trap focus (implement ต่อ project) |
| Reduced motion | ปิด animation ทุก transition (Section 8) |

---

## 19. Pattern Library (Quick Reference)

### Section Header Divider

```jsx
<div className="vx-section-header">
  <h3>Section Title</h3>
  <span className="badge">TAG</span>
  <div className="line" />
</div>
```

### KPI Card

```jsx
<div className="card">
  <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>LABEL</div>
  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-2xl)' }}>999</div>
  <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-sm)' }}>sub text</div>
</div>
```

### Status Badge

```jsx
<span className="badge badge-success">● Active</span>
<span className="badge badge-danger">● Error</span>
<span className="badge badge-warning">● Pending</span>
```

### Scrollable Table Wrapper

```jsx
<div className="table-scroll-wrap">
  <table>...</table>
</div>
```

---

## 20. Project Config Template

สร้างไฟล์ `project.config.css` ใน project ใหม่แล้ว override เฉพาะที่ต่างออกไป:

```css
/* ─────────────────────────────────────────
   project.config.css — My New Project
   Override design-system defaults here
───────────────────────────────────────── */

:root {
  /* Brand accent color */
  --color-accent:        #3dd65c;
  --color-accent-subtle: rgba(61, 214, 92, 0.09);
  --color-accent-alt:    #f59a3f;

  /* Brand fonts */
  --font-body:    'Sarabun', 'Tahoma', sans-serif;
  --font-display: 'Tahoma', 'Sarabun', sans-serif;

  /* Department colors */
  --color-group-1: #4dcc6a;
  --color-group-2: #f59a3f;

  /* Category colors */
  --color-cat-1: #ef4444;
  --color-cat-2: #f97316;
  --color-cat-3: #3b82f6;
  --color-cat-4: #a855f7;
}
```

---

## Changelog

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-06-05 | Standardized from Thai Summit 4M system — project-agnostic |
| — | 2026-06-04 | Original: Thai Summit 4M Management System |

---

*Design System Standard v1.0 — Industrial Web Applications*
