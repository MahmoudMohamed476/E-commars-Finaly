const TAX_RATE = 0.15;

const cart = [];

function addItem(item) {
  if (!item || typeof item.name !== 'string' || item.name.trim() === '') {
    throw new Error('Item must have a name');
  }
  if (typeof item.price !== 'number' || Number.isNaN(item.price) || item.price < 0) {
    throw new Error('Item price must be a non-negative number');
  }
  const quantity = item.quantity === undefined ? 1 : item.quantity;
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('Quantity must be a positive integer');
  }
  cart.push({ name: item.name.trim(), price: item.price, quantity: quantity });
  return cart.length;
}

function removeItem(name) {
  const index = cart.findIndex(function (i) {
    return i.name.toLowerCase() === String(name).toLowerCase();
  });
  if (index === -1) {
    return false;
  }
  cart.splice(index, 1);
  return true;
}

function calculateSubtotal() {
  return Math.round(
    cart.reduce(function (sum, i) {
      return sum + i.price * i.quantity;
    }, 0) * 100
  ) / 100;
}

function calculateTotal(couponCode) {
  const subtotal = calculateSubtotal();
  const discount = require('./discount.js').calculateDiscount(subtotal, couponCode);
  const afterDiscount = subtotal - discount;
  const tax = Math.round(afterDiscount * TAX_RATE * 100) / 100;
  return Math.round((afterDiscount + tax) * 100) / 100;
}

function clearCart() {
  cart.length = 0;
}

function getItems() {
  return cart.map(function (i) {
    return { name: i.name, price: i.price, quantity: i.quantity };
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addItem, removeItem, calculateSubtotal, calculateTotal, clearCart, getItems, TAX_RATE };
}
