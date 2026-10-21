const cart = require("../src/cart.js");
const discount = require("../src/discount.js");

describe("Unit tests", function () {
  beforeEach(function () {
    cart.clearCart();
  });

  describe("cart.addItem()", function () {
    it("should add a valid item to the cart (normal input)", function () {
      const length = cart.addItem({ name: "Laptop", price: 1000, quantity: 1 });
      expect(length).toBe(1);
      expect(cart.getItems().length).toBe(1);
    });

    it("should default the quantity to 1 when no quantity is given (edge case)", function () {
      cart.addItem({ name: "Mouse", price: 25 });
      expect(cart.getItems()[0].quantity).toBe(1);
    });

    it("should accept an item with price 0 (edge case: free item)", function () {
      cart.addItem({ name: "Free Sample", price: 0, quantity: 1 });
      expect(cart.getItems()[0].price).toBe(0);
    });

    it("should throw an error when the name is missing or empty (invalid input)", function () {
      expect(function () {
        cart.addItem({ price: 10 });
      }).toThrow();
      expect(function () {
        cart.addItem({ name: "   ", price: 10 });
      }).toThrow();
    });

    it("should throw an error when the price is negative or not a number (invalid input)", function () {
      expect(function () {
        cart.addItem({ name: "TV", price: -5 });
      }).toThrow();
      expect(function () {
        cart.addItem({ name: "TV", price: "100" });
      }).toThrow();
    });

    it("should throw an error when the quantity is not a positive integer (invalid input)", function () {
      expect(function () {
        cart.addItem({ name: "TV", price: 10, quantity: 0 });
      }).toThrow();
      expect(function () {
        cart.addItem({ name: "TV", price: 10, quantity: 1.5 });
      }).toThrow();
    });
  });

  describe("cart.calculateSubtotal()", function () {
    it("should return 0 for an empty cart (edge case)", function () {
      expect(cart.calculateSubtotal()).toBe(0);
    });

    it("should sum price * quantity of all items (normal input)", function () {
      cart.addItem({ name: "Book", price: 20, quantity: 3 });
      cart.addItem({ name: "Pen", price: 5, quantity: 2 });
      expect(cart.calculateSubtotal()).toBe(70);
    });
  });

  describe("discount.calculateDiscount()", function () {
    it("should return the correct discount for a valid coupon (normal input)", function () {
      expect(discount.calculateDiscount(100, "WELCOME10")).toBe(10);
      expect(discount.calculateDiscount(200, "SAVE20")).toBe(40);
    });

    it("should be case-insensitive and ignore surrounding spaces (edge case)", function () {
      expect(discount.calculateDiscount(100, "  welcome10 ")).toBe(10);
    });

    it("should return 0 for an unknown coupon or no coupon (edge case)", function () {
      expect(discount.calculateDiscount(100, "NOPE")).toBe(0);
      expect(discount.calculateDiscount(100, "")).toBe(0);
      expect(discount.calculateDiscount(100, null)).toBe(0);
    });

    it("should throw an error for an invalid subtotal or coupon type (invalid input)", function () {
      expect(function () {
        discount.calculateDiscount(-1, "WELCOME10");
      }).toThrow();
      expect(function () {
        discount.calculateDiscount("100", "WELCOME10");
      }).toThrow();
      expect(function () {
        discount.calculateDiscount(100, 10);
      }).toThrow();
    });
  });

  describe("cart.removeItem()", function () {
    it("should remove an existing item and return true (normal input)", function () {
      cart.addItem({ name: "Keyboard", price: 50 });
      expect(cart.removeItem("keyboard")).toBe(true);
      expect(cart.getItems().length).toBe(0);
    });

    it("should return false when the item does not exist (edge case)", function () {
      expect(cart.removeItem("Ghost")).toBe(false);
    });
  });
});
