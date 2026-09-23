# ShopNow — E-Commerce Store

An Amazon-style e-commerce web application built with **React 19**, **TypeScript**, **Vite 8**, and **Tailwind CSS v4**. The UI is inspired by a Figma Make design ("ShopNow") — navy header, orange accents, hero carousel, product grid, deals section with countdown, cart drawer, and full checkout flow.

## Features

- **Homepage** — auto-rotating hero carousel, quick-deal cards, "Shop by Category" grid, "Today's Deals" with a live countdown, and a searchable/filterable product grid
- **Search & category filtering** — search is done from the header (`/?q=...`) and matches title, description, features, and tags; category chips filter by department
- **Product catalog** — 12 seeded products with ratings, review counts, discount badges, and out-of-stock handling
- **Product detail page** — breadcrumbs, price/discount block, feature list, quantity selector, Add to Cart / Buy Now, related products
- **Cart** — slide-out cart drawer (opens on add) plus a full `/cart` page with quantity controls and free-shipping progress ($75 threshold)
- **Checkout** — shipping + payment form, order summary, mock order confirmation (no real payments)
- **Auth** — sign in / create account with persisted session (`localStorage`), account menu in the header, demo + social login buttons
- **Persistence** — cart and user session survive page reloads via `localStorage`

## Tech Stack

| Layer     | Choice                                                        |
| --------- | ------------------------------------------------------------- |
| UI        | React 19 (`react-router-dom` v7 for routing)                  |
| Language  | TypeScript                                                    |
| Build     | Vite 8                                                        |
| Styling   | Tailwind CSS v4 (theme tokens in `src/index.css`)             |
| Icons     | `lucide-react`                                                |
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
│   └── AuthContext.tsx   # User session state + localStorage persistence
├── data/
│   └── products.ts       # Product/category seed data (tested)
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
- Yellow buttons `#FFD814`, red sale badges `#CC0C39`, price-blue links `#007185`
- Fonts: **Outfit** (display/headings, `font-display`) + **Inter** (body)
- Surface background `#EAEDED`

Use tokens like `bg-navy`, `text-orange`, `font-display` in JSX instead of hardcoding hex (arbitrary values `bg-[#...]` are reserved for colors outside the theme).

## Running the Project

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server
npm run build      # typecheck + production build → dist/
npm run preview    # serve the production build
```

## Tests

```bash
npm test           # run the suite once (18 tests across 5 files)
npm run test:watch # watch mode
npx vitest -t "<name>"  # filter by test name
```

- `format.test.ts` — price formatting
- `products.test.ts` — data integrity (unique ids, sane prices, category mapping, stock consistency)
- `CartContext.test.tsx` — cart add/merge/remove/update, subtotal, count, persistence
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

- Checkout and auth are **mock/demo** — no real payment or backend.
- Product images load from Unsplash; the app needs internet access for them to appear.