<div align="center">

# Haj PC — Web

Next.js admin for the store: dashboard, catalog, orders, and users. RTL, dark UI, green brand.

<br />

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=zustand&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22C55E?style=for-the-badge&logo=chartdotjs&logoColor=white)

<br />

<img src="../../screenshots/screenshot.png" alt="Haj PC admin dashboard" width="80%" />

<p><em>Dashboard — products, low stock, 30-day revenue, and category mix.</em></p>

</div>

---

## What you get

| Area | What it does |
| --- | --- |
| **Dashboard** | KPIs, revenue-by-category donut, 30-day trend |
| **Products** | Grid, create/edit, images (upload on submit), stock |
| **Categories** | Nested catalog management |
| **Orders** | List, detail, status flow |
| **Users** | Staff accounts and roles |
| **Search** | Header search across admin entities |

UI: Base UI + shadcn-style components, Lucide icons, Sonner toasts, React Hook Form.

## Run it

From the **repo root** (recommended — Turbo starts API + web together):

```bash
pnpm dev
```

Frontend only:

```bash
pnpm --filter web dev
```

App: [http://localhost:3000](http://localhost:3000)

`/` checks auth cookies and sends you to sign-in or `/admin/dashboard`.

## Environment

Copy [`/.env.example`](.env.example):

```bash
API_URL=http://localhost:7700
```

Next.js rewrites `/api/*` to `${API_URL}/api/*`, so the browser stays same-origin.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Next.js on port **3000** |
| `pnpm build` | Production build |
| `pnpm start` | Serve the build |
| `pnpm lint` | ESLint (zero warnings) |
| `pnpm check-types` | `next typegen` + `tsc` |
| `pnpm format` | Prettier |

## Layout

```
app/
├── admin/           Dashboard, products, categories, orders, users
├── auth/signin/     Login
components/ui/       Shared primitives
store/               Auth (Zustand)
```

Shared types come from `@repo/types`.
