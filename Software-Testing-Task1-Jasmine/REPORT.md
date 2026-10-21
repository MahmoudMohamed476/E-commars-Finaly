# Software Testing – Task 1: Unit & Integration Testing Using Jasmine

**Application:** Shopping Cart (Node.js + Jasmine)
**Run tests:** `npm install` then `npm test` (18 specs, 0 failures)

## Structure

- `src/cart.js` – cart module: `addItem`, `removeItem`, `calculateSubtotal`, `calculateTotal`
- `src/discount.js` – discount module: `calculateDiscount`
- `spec/unitSpec.js` – 14 unit tests
- `spec/integrationSpec.js` – 4 integration tests

## 3. What I tested with Unit Testing

Each function was tested **in isolation**, without depending on the others:

- `addItem()` – valid item added; missing/blank name, negative/non-numeric price, and quantity 0 or 1.5 all rejected; quantity defaults to 1; price 0 (free item) accepted.
- `calculateSubtotal()` – returns 0 for an empty cart; correctly sums `price × quantity` across items.
- `calculateDiscount()` – correct percentage for valid coupons; case/space-insensitive codes; returns 0 for unknown/empty/null coupons; throws on negative or non-numeric subtotal and non-string coupon.
- `removeItem()` – removes an existing item (case-insensitive) and returns `true`; returns `false` for an item that isn't in the cart.

**Total: 14 unit specs** (requirement was ≥ 8).

## 4. What I tested with Integration Testing

These tests verify that **multiple units work together** correctly:

1. `addItem()` → `calculateSubtotal()` – after adding two items, the subtotal equals the expected sum.
2. `addItem()` → `calculateTotal()` – total includes the 15% tax (200 → 230).
3. `discount.calculateDiscount()` inside `cart.calculateTotal()` – a coupon added in `addItem()` is discounted by `discount.js`, then taxed (200 − 40 = 160 + 24 tax = 184).
4. `removeItem()` → `calculateSubtotal()` → `calculateTotal()` – removing an item correctly lowers both the subtotal and the final total.

**Total: 4 integration specs** (requirement was ≥ 3).

## 5. Difference between Unit and Integration Testing in this project

- **Unit testing** calls one function at a time and feeds it inputs directly, checking only that function's logic (validation, arithmetic, edge cases). Example: calling `calculateDiscount(100, 'SAVE20')` alone.
- **Integration testing** exercises a **flow across modules**: items go into the cart, then the subtotal, discount, and tax logic in `cart.js` and `discount.js` must cooperate to produce the correct final price. Failures here mean the wiring between units is broken, even if each unit passes its own tests.

## 6. Bugs / failures discovered and fixed

- **Syntax error in `unitSpec.js`:** a misplaced parenthesis in the negative-price expectation (`expect(function () { ... })).toThrow()`). Fixed to `expect(function () { ...; }).toThrow()` — caught immediately when Jasmine parsed the spec file.
- **Rounding risk in totals:** floating-point arithmetic (e.g. 10% of 0.1-style values) could produce totals like `183.99999999999997`. Fixed by rounding subtotal, discount, and tax to 2 decimal places (`Math.round(x * 100) / 100`).
- No application-logic test failures remained after these fixes: **18 specs, 0 failures**.
