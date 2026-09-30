# ShopNow — Code Walkthrough (file by file)

Every file in the project and what its code does.

## Entry points

### `src/main.tsx`
React entry point. Imports the Tailwind stylesheet (`index.css`), mounts `<App />` inside `<StrictMode>` onto `#root`. StrictMode double-invokes effects in dev to surface bugs.

### `src/index.css`
Tailwind v4 stylesheet.
- Pulls in Google Fonts **Outfit** (display font) and **Inter** (body font).
- `@import 'tailwindcss'` enables Tailwind v4's CSS-first config.
- `@custom-variant dark (&:where(.dark, .dark *));` — makes the `dark:` variant work off the `.dark` class on any ancestor (class-based dark mode).
- Defines the design tokens in `@theme`: `--color-navy` (`#131921`), `--color-navy-mid` (`#232F3E`), `--color-navy-light` (`#37475A`), `--color-orange` (`#FF9900`) and its `-light`/`-dark` shades, plus `--color-surface` (`#EAEDED`) and `--color-surface-dark` (`#D5D9D9`). These generate utilities like `bg-navy`, `text-orange`, `bg-surface`.
- The `.dark` block repoints `--color-surface` to `#0F1111` (near-black page background) and `--color-surface-dark` to `#1E242B` (dark panels), and sets `color-scheme: dark` so native controls (scrollbars, inputs, checkboxes) render dark too.
- Global body background uses `var(--color-surface)` so it flips with the theme automatically.

## App shell

### `src/App.tsx`
The router + layout. `App` wraps everything in `ErrorBoundary` → `ThemeProvider` → `BrowserRouter` → `AuthProvider` → `CartProvider`. `Layout` renders `Navbar`, the `CartDrawer`, a `<main>` containing all `<Routes>`, and `Footer`, all on a `bg-surface` (theme-aware) column. Routes: `/` (Home), `/product/:id` (ProductDetail), `/cart`, `/checkout`, `/login`, and `*` falling back to Home.

### `src/components/ErrorBoundary.tsx`
A class-component error boundary that catches render errors anywhere below it. Shows a styled fallback (clipboard-style error block with the message, its own "Go to homepage" button + re-render) instead of a blank page. Everything else keeps working because the boundary is at the top.

## Contexts (global state)

### `src/context/ThemeContext.tsx` — dark mode
- `getInitialTheme()` reads `localStorage['ecom_theme']`; falling back to `window.matchMedia('(prefers-color-scheme: dark)')` if the OS prefers dark, else light.
- `ThemeProvider` holds `theme` state; a `useEffect` toggles the `.dark` class on `document.documentElement` (this is what activates all `dark:` utilities) and persists the choice to localStorage on every change.
- Exposes `theme` and `toggleTheme()` via `useTheme()`. `toggleTheme` flips light ↔ dark.

### `src/context/CartContext.tsx` — shopping cart
Holds the cart plus the drawer open/closed state — globally (add from ProductCard and see it in the header/drawer).
- Items are seeded from `localStorage['ecom-cart']` with a sanity filter (only entries with a valid numeric `product.id` and `quantity` survive), and every change is written back.
- `addToCart` merges quantities if the product is already in the cart, otherwise appends `{ product, quantity }`.
- `updateQuantity(id, q)` — q <= 0 removes the item (handles both decrement and delete).
- `removeFromCart`, `clearCart`, `openCart`, `closeCart`, and memoized `subtotal` (price × qty summed) + `count` (sum of quantities). Exposed via `useCart()`.

### `src/context/AuthContext.tsx` — sessions (mock auth)
- Restores the signed-in user from `localStorage['shophub_auth_user']` on boot and persists/removes it automatically.
- `login(email, name?)` and `register(name, email, password?)` are **mock**: they wait ~500ms to simulate a network call, then synthesize a `User` (random `usr_…` id, a display name derived from the email prefix if none given, a DiceBear avatar URL) — no real backend or password validation.
- `logout()` clears the user. `useAuth()` exposes `user`, `isAuthenticated`, `login`, `register`, `logout`.

## Data

### `src/types/index.ts`
Shared TypeScript contracts: `Product` (id, title, price, optional `originalPrice`, rating, reviewCount, category, description, image, optional badge, stock info, features, tags), `CartItem` (`{ product, quantity }`), `Review`, `OrderDetails` (order summary snapshot for checkout), `User`.

### `src/data/products.ts`
The product catalog: 12 hardcoded `Product` objects with real-ish specs, descriptions, features, tags, discount prices, ratings, and stock counts. Images come from a small `imgs` map of Unsplash URLs, so data stays clean and image URLs are reused/typed by seed name.
- `categories` — deduped, sorted list of product categories (drives the category chips).
- `getProduct(id)` — O(n) lookup by id, used by ProductDetail.

## Components (presentational)

### `src/components/Navbar.tsx` — header + cart drawer
The Amazon-style header (default-exported `Navbar`) plus the slide-in `CartDrawer` (named export, used separately in `App.tsx`).
- **Navbar** reads cart `count`, auth `user`, and theme. Contents: logo (`shop<span>now</span>`), "Delivering to New York" fake geolocation, a search form with a category dropdown that navigates to `/?q=<query>`, account/returns header links, a moon/sun **dark-mode toggle**, the cart button (opens the drawer), and a mobile menu. When signed in, shows a dropdown menu (email/name, "My Cart", Sign Out) with a click-outside-to-close effect via `useRef` + `mousedown` listener.
- **CartDrawer** is a fixed overlay: dimmed backdrop + right-hand panel. Lists cart items with image/title/price, quantity +/− steppers, an item counter with per-item and total subtotal, a free-shipping progress note ($75 threshold) wrapping to "Proceed to Checkout" (`/checkout`).

### `src/components/Hero.tsx`
Auto-rotating hero carousel. Three `slides` (title, subtitle, description, CTA, Unsplash image, theme `color`). A `setInterval` advances `current` every 5s (modulo the slide count). Renders all slides stacked absolutely with `opacity` transitions; current slide gets full opacity + pointer events. Left/right arrow buttons and clickable dot indicators.

### `src/components/Categories.tsx`
"Shop by Category" grid. Renders the `categories` list as cards (Unsplash image + name); clicking a category calls `onSelect` (Home scrolls the grid and activates that filter chip).

### `src/components/DealsSection.tsx`
"Today's Deals" strip with a live countdown. A local `time` state counts down from 16h to a target (computed once), split into hours/minutes/seconds and padded to 2 digits, ticking every second via `useEffect` + `setInterval`. Shows the first few `products` (those with `originalPrice`) as `ProductCard`s; `onAdd` wires "Add to Cart".

### `src/components/ProductCard.tsx`
One product tile. Extras:
- `StarRating` — five stars; filled (orange) up to `Math.round(rating)`, hollow/`#CCC` after, plus a review count.
- `Discount` — red (Amazon `#CC0C39`) badge with the percent off computed from price vs originalPrice.
- Card shows image (lazy-loaded, hover-zoom), optional promo/badge chip, a "Sold out" overlay + disabled Add button when `!inStock`, title (2-line clamp), rating, price + struck-through original price, "FREE delivery", and the amber **Add to Cart** button which calls `onAdd(product)`.

### `src/components/Footer.tsx` — `footerLinks` object → four link columns plus "Back to top" (scrolls window to top), the `shop<span>now</span>` wordmark, and a bottom info bar. Rendered in navy (`bg-navy-mid`/`bg-navy-light`).

## Pages

### `src/pages/Home.tsx`
The storefront. Reads `?q=` from the URL via `useSearchParams` and holds `activeCategory` filter state.
- `filtered` (memoized) runs the query + category filter over `products` — case-insensitive title/description match plus feature/tag keyword search.
- When not filtering (no query, category "All") it shows the full homepage: `Hero`, quick-deal cards, `Categories`, `DealsSection`.
- Otherwise it shows a "Results for …" header and the product grid. Category chips filter the grid; choosing one smooth-scrolls to the grid (`scrollIntoView` with a scroll-margin so the sticky header doesn't cover it).
- `isFiltering` = query or non-"All" category → hides the marketing sections while searching. No results → friendly empty state with a "Browse All Products" reset button. Add-to-cart also opens the drawer.

### `src/pages/ProductDetail.tsx`
Single product page. `getProduct(id)` from the `:id` param; if missing, shows "Product not found" + home link.
- Left: product image in a lightbox-style panel. Right: breadcrumb, title, star rating + reviews, price block (discount % badge + struck-through original), stock status, a feature ✓ list, quantity stepper, and amber Add to Cart (+ Buy Now orange button).
- Quantity is capped at `stockCount`. A thumbnails column highlights the current image. "Related products" grid trails the bottom (same category, excluding self).

### `src/pages/Cart.tsx`
Shopping cart page. Empty state (icon + "Start shopping" link) vs the full list.
- Lists each `CartItem`: image, title (links to product), discount badge if applicable, Delete button, +/− quantity stepper, line total.
- `shipping` = $6.99, waived at the `$75` free-shipping threshold; the sidebar shows subtotal, a "Add $X for FREE shipping" nudge or green FREE-shipping confirmation, the shipping row, and a "Proceed to Checkout" button.

### `src/pages/Checkout.tsx`
Two states:
- **Order placed**: if the user just submitted, a success screen with the synthesized order id, delivery address, and order summary.
- **Form**: guarded so an empty cart routes to a "cart is empty" prompt with a Continue Shopping button. A `CheckoutFlow` form collects shipping details (name, email, address, city, postal code) + payment via two radio "cards" (`has-checked:` styling shows selection). Submitting with the required fields builds an `OrderDetails` object (random order id, computed shipping fee/subtotal/total, timestamp), clears the cart, and switches to the confirmation screen. If not signed in it shows a link to `/login`.

### `src/pages/Login.tsx`
Mock sign in / create account / password-recovery page.
- `AuthGuard mode` tabs (Sign in / Create account) switch the active form; the tab underline/panel is the classic white-pill-on-gray pattern.
- **Sign in**: email + password (with show/hide eye toggle), on submit calls `login()` and redirects to `/` via `navigate(from, …)` so the previous protected page is restored.
- **Create account**: name + email + password; calls `register()`.
- **Reset password** flow: email field + "Reset" button toggling a sent-state screen.
- Demo/social-style buttons, "forgot password?", and "Back to sign in" links. No real backend — any credentials work.

## Shared utilities

### `src/utils/format.ts`
`formatPrice(amount)` → `Intl.NumberFormat('en-US', { style:'currency', currency:'USD' })` (e.g. `$129.99`). Used across ProductCard, Cart, Checkout, Navbar.

## Tests (Vitest + Testing Library)

- `src/utils/format.test.ts` — price formatting (whole numbers, decimals, thousands).
- `src/data/products.test.ts` — data integrity: unique ids, positive prices, valid categories/ratings, deal products have a valid originalPrice > price, categories helper correctness.
- `src/context/CartContext.test.tsx` — add merges quantities, removal, quantity updates (to 0 removes), subtotal/count math, localStorage persistence round-trip.
- `src/context/ThemeContext.test.tsx` — default light; toggle flips the `.dark` class on `<html>` and persists to `ecom_theme`; a stored dark preference is restored.
- `src/pages/Home.test.tsx` — home renders hero/sections; search filters the grid; empty results state; category chip filtering.
- `src/App.test.tsx` — full-tree smoke test (header/home/footer render) and a real click-through: adding a product opens the cart drawer.

All test files that touch the DOM start with `// @vitest-environment jsdom`. The `scrollIntoView` DOM stub is applied in the Home/App tests because jsdom doesn't implement it.