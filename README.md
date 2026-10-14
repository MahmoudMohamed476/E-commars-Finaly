# ShopNow — E-Commerce Store

An Amazon-style e-commerce web application built with **React 19**, **TypeScript**, **Vite 8**, and **Tailwind CSS v4**. The UI is inspired by a Figma Make design ("ShopNow") — navy header, orange accents, hero carousel, product grid, deals section with countdown, cart drawer, and full checkout flow.

## Features

- **Homepage** — auto-rotating hero carousel, quick-deal cards, "Shop by Category" grid, "Today's Deals" with a live countdown, and a searchable/filterable product grid
- **Search & category filtering** — search is done from the header (`/?q=...`) and matches title, description, features, and tags; category chips filter by department
- **Product catalog** — 12 seeded products with ratings, review counts, discount badges, and out-of-stock handling
- **Product detail page** — breadcrumbs, price/discount block, feature list, quantity selector, Add to Cart / Buy Now, related products
- **Dark mode** — moon/sun toggle in the header, persists to `localStorage`, defaults to OS preference, full dark palette across every page
- **Cart** — slide-out cart drawer (opens on add) plus a full `/cart` page with quantity controls and free-shipping progress ($75 threshold)
- **Checkout** — shipping + payment form, order summary, mock order confirmation (no real payments); orders are saved to Supabase for signed-in users
- **Auth** — sign in / create account with persisted session; uses **Supabase Auth** when keys are configured, otherwise falls back to a local demo session (`localStorage`), with an account menu in the header and demo + social login buttons
- **Persistence** — cart survives page reloads via `localStorage`; user session and orders persist through Supabase (demo session persists via `localStorage`)
- **Products from the database** — the catalog is seeded from Supabase when configured and falls back to the built-in seed data (`src/data/products.ts`) otherwise

## Tech Stack

| Layer     | Choice                                                        |
| --------- | ------------------------------------------------------------- |
| UI        | React 19 (`react-router-dom` v7 for routing)                  |
| Language  | TypeScript                                                    |
| Build     | Vite 8                                                        |
| Styling   | Tailwind CSS v4 (theme tokens in `src/index.css`)             |
| Icons     | `lucide-react`                                                |
| Backend   | Supabase (Postgres + Auth) — optional, see below              |
| Tests     | Vitest 5 + Testing Library + jsdom                            |
| Lint      | oxlint                                                        |
| Format    | oxfmt                                                         |

## Project Structure

```
src/
├── main.tsx              # React entrypoint
├── index.css             # Fonts + Tailwind v4 theme (colors, font-display/body)
├── App.tsx               # Router + providers + layout shell
├── App.test.tsx          # Full-tree smoke test (render + add-to-cart)
├── components/
│   ├── Navbar.tsx        # Amazon-style header + secondary nav + CartDrawer
│   ├── Hero.tsx          # Auto-rotating hero carousel
│   ├── Categories.tsx    # "Shop by Category" image grid
│   ├── DealsSection.tsx  # Today's Deals + countdown timer
│   ├── ProductCard.tsx   # Product card (rating, price, discount, add to cart)
│   ├── Footer.tsx        # Navy footer with "Back to top"
│   └── ErrorBoundary.tsx # Global error fallback UI
├── context/
│   ├── CartContext.tsx   # Cart state + localStorage persistence
│   │                     # (tested in CartContext.test.tsx)
│   ├── AuthContext.tsx   # Supabase Auth (or demo fallback) session state
│   ├── ProductsContext.tsx # Loads catalog from Supabase, seed fallback
│   └── ThemeContext.tsx  # Dark mode state + localStorage persistence
│                         # (tested in ThemeContext.test.tsx)
├── lib/
│   ├── supabase.ts       # Supabase client from env vars (null if unset)
│   └── orders.ts         # saveOrder() → inserts into the orders table
├── data/
│   └── products.ts       # Product/category seed data (tested) + DB fallback
├── pages/
│   ├── Home.tsx          # Hero, deals, category grid, filtered product grid
│   ├── ProductDetail.tsx # Single product view + related items
│   ├── Cart.tsx          # Shopping cart page + order summary
│   ├── Checkout.tsx      # Shipping/payment form + confirmation
│   └── Login.tsx         # Sign in / create account
├── types/
│   └── index.ts          # Product, CartItem, User, OrderDetails, Review
└── utils/
    └── format.ts         # formatPrice (tested)
```

## Routes

| Path          | Page                                     |
| ------------- | ---------------------------------------- |
| `/`           | Home (supports `?q=` search)             |
| `/product/:id`| Product detail                           |
| `/cart`       | Shopping cart                            |
| `/checkout`   | Checkout (redirect-safe sign-in link)    |
| `/login`      | Sign in / create account                  |

## Design System

Defined as Tailwind v4 `@theme` tokens in `src/index.css`:

- `--color-navy` `#131921` — main header
- `--color-navy-mid` `#232F3E` — secondary nav + footer
- `--color-orange` `#FF9900` — accent, search button
- `--color-surface` `#EAEDED` — page background (dark mode: `#0F1111`)
- Yellow buttons `#FFD814`, red sale badges `#CC0C39`, price-blue links `#007185`
- Fonts: **Outfit** (display/headings, `font-display`) + **Inter** (body)

Use tokens like `bg-navy`, `text-orange`, `font-display` in JSX instead of hardcoding hex (arbitrary values `bg-[#...]` are reserved for colors outside the theme). Dark mode is class-based: `ThemeContext` toggles `.dark` on `<html>` and every light surface uses a `dark:` variant.

## Supabase Setup

The app runs **without** Supabase (it uses the built-in seed data and demo auth). To enable real auth, order storage, and database-backed products:

1. Create a project at [supabase.com](https://supabase.com).
2. In the Supabase **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql). It creates the `products` and `orders` tables, sets row-level security (catalog is public-read; orders are per-user), and seeds the 13 products.
3. Copy your project URL and **anon public** key (Project Settings → API).
4. Create a `.env` file in the project root (see `.env.example`):

   ```bash
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

5. Restart `npm run dev`.

Notes:
- Only the **anon public** key goes in the frontend — never the `service_role` key. Access is enforced by the RLS policies in the schema.
- If email confirmation is on (default), a new sign-up won't get a session until the user confirms their email. Turn it off in Authentication → Providers for local testing.
- With Supabase keys present, the "demo" and "social" buttons attempt real sign-in and will only work for accounts that exist in your project.

## Running the Project

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server
npm run build      # typecheck + production build → dist/
npm run preview    # serve the production build
```

Optional: copy `.env.example` to `.env` and fill in your Supabase keys (see [Supabase Setup](#supabase-setup)).

## Tests

```bash
npm test           # run the suite once (22 tests across 7 files)
npm run test:watch # watch mode
npx vitest -t "<name>"  # filter by test name
```

- `format.test.ts` — price formatting
- `products.test.ts` — data integrity (unique ids, sane prices, category mapping, stock consistency)
- `CartContext.test.tsx` — cart add/merge/remove/update, subtotal, count, persistence
- `ProductsContext.test.tsx` — seed-data fallback when Supabase is not configured, getProduct by id
- `ThemeContext.test.tsx` — dark-mode toggle flips the `.dark` class and persists, restores saved theme
- `Home.test.tsx` — section rendering, search results, no-results state, category filtering
- `App.test.tsx` — full-tree render + opening the cart drawer via "Add to Cart"

## Scripts

| Command                 | Action                          |
| ----------------------- | ------------------------------- |
| `npm run dev`           | Dev server with hot reload      |
| `npm run build`         | `tsc -b && vite build`          |
| `npm run test`          | Run tests once                  |
| `npm run test:watch`    | Run tests in watch mode         |
| `npm run lint`          | oxlint                          |
| `npm run format`        | oxfmt                           |

## Notes

- Runs fully client-side with no backend by default (seed data + demo auth + `localStorage` cart). Add Supabase keys to enable real auth, orders, and database products — see [Supabase Setup](#supabase-setup).
- Checkout still processes **no real payments** — order records are just stored.
- Product images load from Unsplash; the app needs internet access for them to appear.