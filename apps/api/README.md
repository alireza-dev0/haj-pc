<div align="center">

# Haj PC — API

NestJS REST backend for the store: JWT cookies, Prisma on Postgres, product images on Supabase.

<br />

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Passport](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=black)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

</div>

---

## What it serves

Global prefix: **`/api`**. CORS is locked to `FRONTEND_URL` with credentials.

| Module | Responsibility |
| --- | --- |
| **Auth** | Sign-in, refresh, profile — JWT in HTTP-only cookies |
| **Users** | Admin CRUD, roles (`ADMIN` / `USER`) |
| **Products** | Catalog, stock, images |
| **Categories** | Product grouping |
| **Orders** | Lifecycle: pending → processing → shipped → delivered |
| **Dashboard** | Aggregates for the admin home |
| **Search** | Cross-entity lookup |
| **Storage** | Image upload/delete (Supabase bucket) |

Validation is **Zod** (`nestjs-zod`). Shared shapes live in `@repo/types`.

## Run it

From the **repo root**:

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
# fill DATABASE_URL, JWT_SECRET, FRONTEND_URL, Supabase…
pnpm --filter api dev
```

Or from this folder: `pnpm dev` (watch mode, `NODE_ENV=development`).

| | |
| --- | --- |
| API | [http://localhost:7700/api](http://localhost:7700/api) |
| Scalar | [http://localhost:7700/api/docs/scalar](http://localhost:7700/api/docs/scalar) |
| Swagger | [http://localhost:7700/api/docs/swagger](http://localhost:7700/api/docs/swagger) |

Docs routes are registered in **development** only.

### Database

```bash
pnpm db:seed    # prisma/seed.ts via tsx
```

Prisma client is generated into `src/prisma/generated`. Provider: **PostgreSQL**.

## Environment

See [`.env.example`](.env.example):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` / `DIRECT_URL` | Postgres (Prisma) |
| `SUPABASE_URL` / `SUPABASE_SECRET` | Storage client |
| `SUPABASE_STORAGE_BUCKET` | Default `products` |
| `FRONTEND_URL` | CORS origin |
| `PORT` | Default **7700** |
| `JWT_SECRET` | Access/refresh signing |
| `REDIS_URL` | Optional cache |

Never commit `.env`.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Watch |
| `pnpm start` | One-shot development |
| `pnpm start:prod` | `node dist/main` |
| `pnpm build` | `nest build` |
| `pnpm lint` | ESLint |
| `pnpm test` / `test:e2e` / `test:cov` | Jest |
| `pnpm db:seed` | Seed |

## Layout

```
src/
├── main.ts              Prefix, CORS, Scalar + Swagger
├── modules/             auth, users, product, category, order, dashboard, search, storage
└── common/              guards, filters, role decorator
prisma/
├── schema.prisma
└── seed.ts
```
