const cart = require("../src/cart.js");
const discount = require("../src/discount.js");

describe("Integration tests (modules working together)", function () {
  beforeEach(function () {
    cart.clearCart();
  });

  it("addItem() followed by calculateSubtotal() should produce the correct subtotal", function () {
    cart.addItem({ name: "Laptop", price: 1000, quantity: 1 });
    cart.addItem({ name: "Mouse", price: 50, quantity: 2 });
    expect(cart.calculateSubtotal()).toBe(1100);
  });

  it("addItem() followed by calculateTotal() should include 15% tax on the subtotal", function () {
    cart.addItem({ name: "Laptop", price: 200, quantity: 1 });
    // subtotal 200 -> tax 30 -> total 230
    expect(cart.calculateTotal()).toBe(230);
  });

  it("discount.calculateDiscount() should be applied inside cart.calculateTotal() when a coupon is used", function () {
    cart.addItem({ name: "Laptop", price: 200, quantity: 1 });
    // subtotal 200, coupon SAVE20 -> discount 40 -> 160 + 15% tax(24) = 184
    expect(cart.calculateTotal("SAVE20")).toBe(184);
    expect(discount.calculateDiscount(200, "SAVE20")).toBe(40);
  });

  it("removeItem() should update the total calculated by calculateTotal()", function () {
    cart.addItem({ name: "Laptop", price: 100, quantity: 1 });
    cart.addItem({ name: "Mouse", price: 100, quantity: 1 });
    expect(cart.calculateTotal()).toBe(230);
    cart.removeItem("Mouse");
    expect(cart.calculateSubtotal()).toBe(100);
    expect(cart.calculateTotal()).toBe(115);
  });
});
