# Project: PC Parts Store — Admin Panel

## Overview

An admin dashboard for managing a computer parts e-commerce store. This is the **admin/management side only** — no public storefront in this phase. The storefront may be built later as a separate project.

## Scope Boundary

This project = **admin panel only**: product management, order management, and a summary dashboard. No checkout flow, no public product pages, no payment gateway integration.

---

## Domain / Categories

Products belong to one of these fixed categories (no subcategories, no nested taxonomy):

- Case (کیس)
- Power Supply (پاور)
- RAM (رم)
- Motherboard (مادربورد)
- SSD
- HDD
- Graphics Card (کارت گرافیک)
- CPU (پردازنده)

No laptops, no peripherals, no other categories. Do not add fields specific to each category (e.g. RAM speed, PSU wattage as separate structured fields) — keep the product model generic across all categories. Category-specific specs go in the plain `description` text field.

---

## Data Model

### User (admin)

- id
- email
- password (hashed)
- name
- role (single role: `admin` — no multi-role system)

### Product

- id
- name
- category (enum: the 8 categories above)
- price (number)
- stock (integer)
- description (plain text)
- imageUrl (single image, string URL — no image gallery)
- createdAt / updatedAt

### Order

- id
- customerName
- customerPhone (or email — pick one, keep it simple)
- status (enum: `pending`, `processing`, `shipped`, `delivered`)
- totalAmount (number)
- createdAt / updatedAt

### OrderItem

- id
- orderId (relation to Order)
- productId (relation to Product)
- quantity
- priceAtOrder (snapshot of product price at time of order)

---

## Features

### 1. Auth

- Login (email + password → JWT)
- Logout
- Get current user (`/auth/me`)
- No signup flow needed — admin account is seeded, not self-registered.

### 2. Product Management

- List products (with filter by category, search by name)
- Create product
- Edit product
- Delete product
- View single product detail

### 3. Order Management

- List orders (with filter by status)
- View single order detail (customer info + list of items + total)
- Update order status (dropdown: pending → processing → shipped → delivered)
- No order creation form needed — orders are seeded as fake data (see Seed Data section). Admin only views and updates status.

### 4. Dashboard (summary page)

- KPI cards: total orders, total revenue, low-stock product count (stock < 5, threshold can be hardcoded)
- Chart: sales over time (line or bar chart, by day/week)
- Chart: order count or revenue by category (pie or bar chart)

### 5. (Optional — only if time remains)

- Customer list (derived from orders, no separate customer accounts/auth needed)
- CSV export of orders or products

---

## Explicit Non-Goals (do not build these)

- ❌ Public storefront / customer-facing pages
- ❌ Real payment gateway integration
- ❌ Category-specific structured fields (e.g. wattage, RAM speed as separate inputs)
- ❌ Multi-role permission system (only one role: admin)
- ❌ Coupon / discount system
- ❌ Multi-image product gallery
- ❌ Customer authentication or customer accounts
- ❌ Order creation form (orders come from seed data only)
- ❌ Advanced reporting (PDF reports, scheduled emails, etc.) — CSV export is the max
- ❌ Inventory history / audit log
- ❌ Real-time updates via WebSocket (this is a normal CRUD dashboard, not real-time)

---

## Seed Data Requirement

Since there is no public storefront generating real orders, write a seed script that creates:

- ~15-20 products spread across all 8 categories, with realistic names and approximate real prices
- ~20-30 fake orders with random statuses, dates spread over the last 1-2 months, and 1-3 order items each

This is required for the dashboard charts and KPIs to show meaningful data instead of empty states.

---

## Tech Notes (keep minimal, standard)

- Error handling: one global exception filter, nothing custom per-module
- Logging: basic console logging is enough, no structured logging pipeline
- API docs: basic Swagger setup is enough if used, not required to document every field in depth
- No automated test suite required (unit/e2e) — manual testing is sufficient for this project's purpose

---

## Definition of Done

1. Admin can log in and reach the dashboard
2. Full CRUD works for products, filterable by category
3. Orders list is visible, filterable by status, and status can be updated
4. Dashboard shows at least 3 KPI cards and 2 charts with real (seeded) data
5. Seed script runs and populates realistic data
6. Deployed (backend + frontend) and reachable via a live URL

---

## Suggested Build Order

1. Data models + migrations (Product, Order, OrderItem)
2. Auth (login, JWT, `/auth/me`, logout)
3. Product CRUD (backend + frontend)
4. Seed script (products + fake orders)
5. Order list + status update (backend + frontend)
6. Dashboard page (KPIs + charts)
7. Deploy
