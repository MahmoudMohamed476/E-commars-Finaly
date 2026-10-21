const DISCOUNT_CODES = {
  WELCOME10: 0.10,
  SAVE20: 0.20,
  HALF: 0.5
};

function calculateDiscount(subtotal, code) {
  if (typeof subtotal !== 'number' || Number.isNaN(subtotal) || subtotal < 0) {
    throw new Error('Invalid subtotal');
  }
  if (code === null || code === undefined || code === '') {
    return 0;
  }
  if (typeof code !== 'string') {
    throw new Error('Invalid coupon code');
  }
  const rate = DISCOUNT_CODES[code.trim().toUpperCase()];
  if (rate === undefined) {
    return 0;
  }
  return Math.round(subtotal * rate * 100) / 100;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateDiscount, DISCOUNT_CODES };
}
