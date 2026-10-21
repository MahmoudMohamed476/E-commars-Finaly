# Software Testing – Task 1: Unit & Integration Testing Using Jasmine

## 1. What This Task Is About

The assignment asked me to:

1. Create a small JavaScript application with **2–3 functions/modules that interact with each other**.
2. Write **at least 8 unit tests** using the Jasmine testing framework.
3. Write **at least 3 integration tests** using Jasmine.
4. Submit the code, the tests, and a report explaining what I tested and what I learned.

I chose to build a **Shopping Cart** application, because it naturally has multiple functions that depend on each other (adding items → calculating subtotal → applying coupons → calculating the final total with tax).

Everything is in this folder:

```
Software-Testing-Task1-Jasmine/
├── src/
│   ├── cart.js          # Cart module (addItem, removeItem, calculateSubtotal, calculateTotal)
│   └── discount.js      # Discount module (calculateDiscount)
├── spec/
│   ├── unitSpec.js      # 14 unit tests
│   └── integrationSpec.js # 4 integration tests
├── jasmine.json         # Jasmine configuration
├── package.json         # Project file + test script
└── REPORT.md            # The short report required by Part 3
```

---

## 2. The Application – How It Works

The app is made of **two modules** (two files) that each contain functions, and these functions **call each other** to do their job.

### Module 1: `src/discount.js` – Coupon / Discount Logic

This module knows about coupon codes and how to calculate the discount amount.

```js
const DISCOUNT_CODES = {
  WELCOME10: 0.10,   // 10% off
  SAVE20:    0.20,   // 20% off
  HALF:      0.50    // 50% off
};

function calculateDiscount(subtotal, couponCode) { ... }
```

`calculateDiscount(subtotal, couponCode)` works like this:

| Situation | What it returns | Example |
|---|---|---|
| Valid coupon code | The discount amount (percentage of subtotal) | `calculateDiscount(200, "SAVE20")` → **40** |
| Code written in lowercase or with spaces | Still works (case-insensitive) | `calculateDiscount(100, "  welcome10 ")` → **10** |
| Unknown code, empty string, or `null` | **0** (no discount) | `calculateDiscount(100, "NOPE")` → **0** |
| Invalid subtotal (negative, not a number) | **Throws an error** | `calculateDiscount(-1, "SAVE20")` → ❌ Error |
| Coupon that is not a string | **Throws an error** | `calculateDiscount(100, 10)` → ❌ Error |

### Module 2: `src/cart.js` – Shopping Cart Logic

This module keeps a list of items in the cart and can calculate prices.

```js
const cart = [];        // empty array = empty cart
const TAX_RATE = 0.15;  // 15% tax

function addItem(item) { ... }            // add one item to the cart array
function removeItem(name) { ... }         // remove an item by its name
function calculateSubtotal() { ... }      // sum of (price × quantity) for all items
function calculateTotal(couponCode) { ... } // subtotal − discount + tax
```

**Step by step, `calculateTotal("SAVE20")` does this:**

```
Step 1: calculateSubtotal()        →  adds up all items        → 200
Step 2: discount.calculateDiscount(200, "SAVE20") → applies 20% → −40
Step 3: after discount             →  200 − 40                 → 160
Step 4: add 15% tax                →  160 × 0.15               → +24
Step 5: final total                →  160 + 24                 → 184 ✅
```

Notice that **Step 2 calls a function from the other module** (`discount.js`). This is exactly what makes integration testing possible — the two modules are wired together.

---

## 3. How to Run the Tests

Open a terminal in this folder and run:

```bash
npm install   # first time only – installs Jasmine
npm test      # runs all the tests
```

You will see:

```
Started
..................

18 specs, 0 failures
Finished in 0.026 seconds
```

- **18 specs** = 18 test cases total.
- **0 failures** = all tests passed ✅.

If any test fails, Jasmine prints a red `F` instead of a green `.` and shows you exactly which expectation failed and why.

---

## 4. Part 1 – Unit Testing (14 tests) – Explained

### What is unit testing?

**Unit testing = testing ONE function by itself**, in isolation, like putting it under a microscope. You give the function an input and check what it returns — you do **not** involve other functions.

### What I tested (`spec/unitSpec.js`)

I wrote unit tests for **4 functions**: `addItem`, `calculateSubtotal`, `calculateDiscount`, `removeItem`. Every test group covers three kinds of inputs, as the task requires:

#### A. `addItem()` – 6 tests

| # | Type | Test | Why |
|---|---|---|---|
| 1 | Normal | A valid item (`{name:"Laptop", price:1000, quantity:1}`) is added and cart length becomes 1 | The basic happy path |
| 2 | Edge | No quantity given → quantity defaults to `1` | Browsers/users often omit quantity |
| 3 | Edge | Price = 0 (a free sample) is allowed | Zero is valid, only negatives are wrong |
| 4 | Invalid | Missing name or blank name `"   "` → throws error | The cart must reject garbage items |
| 5 | Invalid | Negative price `-5` or price as string `"100"` → throws error | You can't sell at a negative price |
| 6 | Invalid | Quantity `0` or `1.5` → throws error | Quantity must be a whole positive number |

#### B. `calculateSubtotal()` – 2 tests

| # | Type | Test |
|---|---|---|
| 7 | Edge | Empty cart → returns `0` (not `NaN` or a crash) |
| 8 | Normal | Book ×3 (20) + Pen ×2 (5) = **70** |

#### C. `calculateDiscount()` – 4 tests

| # | Type | Test |
|---|---|---|
| 9 | Normal | `100` with `WELCOME10` → `10`; `200` with `SAVE20` → `40` |
| 10 | Edge | `"  welcome10 "` (lowercase + spaces) still works → `10` |
| 11 | Edge | Unknown code / empty string / `null` → returns `0` |
| 12 | Invalid | Negative subtotal, string subtotal, or number coupon → throws error |

#### D. `removeItem()` – 2 tests

| # | Type | Test |
|---|---|---|
| 13 | Normal | Existing item removed (case-insensitive: `"keyboard"` matches `"Keyboard"`) → returns `true` |
| 14 | Edge | Item not in cart → returns `false` (not a crash) |

### Example test code

```js
it('should return the correct discount for a valid coupon (normal input)', function () {
  expect(discount.calculateDiscount(100, 'WELCOME10')).toBe(10);
  expect(discount.calculateDiscount(200, 'SAVE20')).toBe(40);
});
```

Reading it in plain English: *"We **expect** that if I calculate the discount of 100 with coupon WELCOME10, it **is exactly** 10."*

---

## 5. Part 2 – Integration Testing (4 tests) – Explained

### What is integration testing?

**Integration testing = testing that TWO or more units work correctly TOGETHER.** Instead of testing a function alone, you test a complete flow. In my project, the integration point is where `cart.js` **calls** `discount.js` inside `calculateTotal()`.

### What I tested (`spec/integrationSpec.js`)

#### Test 1 – `addItem()` → `calculateSubtotal()`
Add Laptop (1000) and Mouse (50 × 2), then check the subtotal is **1100**.
This proves that whatever `addItem()` puts into the cart array is correctly read by `calculateSubtotal()`.

#### Test 2 – `addItem()` → `calculateTotal()` (tax is added)
Add a 200 Laptop, then check the total is **230** (200 + 15% tax = 30).
This proves the tax logic is applied on top of the stored items.

#### Test 3 – The full chain: `addItem()` → `discount.calculateDiscount()` → `calculateTotal()`
Add a 200 Laptop and call `calculateTotal('SAVE20')`. Expected: **184**
(200 − 40 discount = 160, + 15% tax = 24 → 184).
This is the most important integration test: it proves the **cart module and the discount module communicate correctly** — the cart passes the subtotal and coupon into the discount function and uses its answer.

#### Test 4 – `removeItem()` → `calculateSubtotal()` → `calculateTotal()`
Add two 100 items (total = 230), remove one, then the subtotal drops to **100** and the total to **115**.
This proves that removing an item actually updates everything that depends on the cart.

### Example test code

```js
it('discount.calculateDiscount() should be applied inside cart.calculateTotal() when a coupon is used', function () {
  cart.addItem({ name: 'Laptop', price: 200, quantity: 1 });
  // subtotal 200, coupon SAVE20 -> discount 40 -> 160 + 15% tax(24) = 184
  expect(cart.calculateTotal('SAVE20')).toBe(184);
  expect(discount.calculateDiscount(200, 'SAVE20')).toBe(40);
});
```

---

## 6. Part 3 – The Difference Between Unit and Integration Testing (in this project)

| | Unit Testing | Integration Testing |
|---|---|---|
| **What it tests** | ONE function alone | Multiple functions/modules together |
| **Dependencies** | None – the other module is not involved | Yes – the modules call each other |
| **Example in my project** | `calculateDiscount(100, 'WELCOME10')` by itself | `addItem()` then `calculateTotal('SAVE20')` (cart + discount) |
| **Speed & scope** | Fast, small, pinpoint | Slightly bigger, checks the "wiring" |
| **If it fails…** | That specific function's logic is broken | The connection between modules is broken (even if each unit is fine alone) |

**A simple analogy:**
- **Unit testing** = testing that a car's engine works when you start it on a stand.
- **Integration testing** = testing that the engine, gearbox, and wheels work together when you actually drive the car.

You need **both**: a project can have perfect unit tests but still fail in integration because the modules were wired together wrongly (e.g. the cart forgot to pass the coupon code to the discount function).

---

## 7. Bugs / Failures I Found and How I Fixed Them

1. **Syntax error in the test file itself** – In `unitSpec.js` I originally wrote a misplaced parenthesis:
   ```js
   expect(function () { cart.addItem({ name: 'TV', price: -5 })).toThrow();  // ❌ wrong
   ```
   Fixed to:
   ```js
   expect(function () { cart.addItem({ name: 'TV', price: -5 }); }).toThrow();  // ✅
   ```
   Jasmine caught it immediately when loading the spec file — a good example of tests catching mistakes in the tests themselves.

2. **Floating-point rounding risk** – Money math in JavaScript can produce ugly results like `183.99999999999997` instead of `184`, because decimals like `0.15` cannot be stored perfectly in binary. I fixed it by rounding the subtotal, discount, and tax to **2 decimal places** everywhere:
   ```js
   Math.round(value * 100) / 100
   ```

After these fixes: **18 specs, 0 failures** ✅.

---

## 8. Final Results

```
Started
..................

18 specs, 0 failures
```

| Requirement | Required | Done |
|---|---|---|
| Testing framework: Jasmine | ✔ | Jasmine 5 (npm) |
| Unit tests ≥ 8 | 8 | **14** |
| Integration tests ≥ 3 | 3 | **4** |
| Normal / edge / invalid inputs covered | ✔ | ✔ |
| Tests executable (`npm test`) | ✔ | ✔ |
| Report (Part 3) | ✔ | `REPORT.md` + this file |
